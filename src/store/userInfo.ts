import { create } from "zustand";
import createSelectors from "./helper/createSelector";
import { ccc } from "@ckb-ccc/core";
import getPDSClient from "@/lib/pdsClient";
import storage from "@/lib/storage";
import {
  ComAtprotoWeb5CreateAccount,
  ComAtprotoServerCreateSession,
} from "web5-api";
import { writesPDSOperation } from "@/app/posts/utils";
import { handleToNickName } from "@/lib/handleToNickName";
// import server from "@/server";
import { fetchUserProfile, userLogin } from "@/lib/user-account";

export type UserProfileType = {
  did: string;
  displayName?: string;
  highlight?: string; // 在白名单内才有这个字段
  post_count?: string;
  reply_count?: string;
  created?: string;
  handle?: string;
};

type UserInfoStoreValue = {
  userInfo?: ComAtprotoServerCreateSession.OutputSchema;
  initialized?: boolean;
  userProfile?: UserProfileType;
  isWhiteListUser?: boolean;
  visitorId?: string;
};

const STORAGE_VISITOR = "@dao:visitor";

type UserInfoStore = UserInfoStoreValue & {
  setStoreData: (storeData: UserInfoStoreValue) => void;
  createUser: (obj: ComAtprotoWeb5CreateAccount.InputSchema) => Promise<void>;
  web5Login: () => Promise<void>;
  getUserProfile: () => Promise<UserProfileType | undefined>;
  logout: () => void;
  writeProfile: () => Promise<"NO_NEED" | "SUCCESS" | "FAIL">;
  resetUserStore: () => void;
  initialize: (signer?: ccc.Signer) => Promise<void>;
};

const useUserInfoStore = createSelectors(
  create<UserInfoStore>((set, get) => ({
    userInfo: undefined,
    initialized: undefined,
    userProfile: undefined,
    isWhiteListUser: undefined,
    visitorId: undefined,

    setStoreData: (params) => {
      set(() => ({ ...params }));
    },

    createUser: async (params) => {
      // 🎯 注册成功断点 - Web5账户创建

      const pdsClient = getPDSClient();
      const createRes = await pdsClient.web5CreateAccount(params);
      const userInfo = createRes.data;

      storage.setToken({
        did: userInfo.did,
        signKey: params.password || "",
        walletAddress: params.ckbAddr,
      });

      // 注册成功后，也将用户会话信息缓存到 Cookie
      storage.setUserSession({
        did: userInfo.did,
        handle: userInfo.handle,
        accessJwt: userInfo.accessJwt,
        refreshJwt: userInfo.refreshJwt,
        ckbAddr: params.ckbAddr,
        cachedAt: Date.now(),
      });

      set(() => ({
        userInfo,
        userProfile: { did: userInfo.did, handle: userInfo.handle },
      }));
    },

    writeProfile: async () => {
      const { userInfo, userProfile } = get();
      if (!userInfo || (userProfile && userProfile.displayName))
        return "NO_NEED";

      // 🎯 注册成功断点 - 写入用户档案
      debugger;
      console.log("📝 开始写入用户档案...");
      console.log("👤 用户档案信息:", {
        did: userInfo.did,
        handle: userInfo.handle,
        displayName: handleToNickName(userInfo.handle),
      });

      try {
        await writesPDSOperation({
          record: {
            $type: "app.actor.profile",
            displayName: handleToNickName(userInfo.handle),
            handle: userInfo.handle,
          },
          did: userInfo.did,
          rkey: "self",
        });
        console.log("✅ 用户档案写入成功！");
        return "SUCCESS";
      } catch (error) {
        console.log("❌ 写入用户档案失败:", error);
        return "FAIL";
      }
    },

    web5Login: async () => {
      // 1. 首先尝试从 Cookie 中获取缓存的会话
      const cachedSession = storage.getUserSession();
      if (cachedSession) {
        console.log("🍪 从Cookie恢复用户会话，跳过登录接口调用");
        set(() => ({
          userInfo: {
            did: cachedSession.did,
            handle: cachedSession.handle,
            accessJwt: cachedSession.accessJwt,
            refreshJwt: cachedSession.refreshJwt,
          },
        }));
        await get().getUserProfile();
        return;
      }

      // 2. Cookie 中没有缓存，则从 localStorage 读取并调用登录接口
      const localStorage = storage.getToken();
      console.log(
        "🔄 Cookie中无缓存，尝试从localStorage恢复用户登录状态:",
        localStorage
      );

      if (!localStorage) {
        console.log("❌ 未找到localStorage中的用户信息");
        return;
      }

      try {
        const userInfoRes = await userLogin(localStorage);
        console.log("🔑 用户登录结果:", userInfoRes);

        if (!userInfoRes) {
          console.log("❌ 用户登录失败");
          return;
        }

        console.log("✅ 用户登录成功，更新store状态");
        set(() => ({ userInfo: userInfoRes }));
        await get().getUserProfile();
      } catch (error) {
        console.error("❌ 用户登录过程中发生错误:", error);
      }
    },

    /* 清除用户信息+缓存 */
    logout: () => {
      const confirm = prompt(
        "登出前请存储好自己的signKey,否则会永久丢失您的did!"
      );
      if (confirm) {
        storage.removeToken();
        storage.removeUserSession(); // 同时清除 Cookie 中的会话
        get().resetUserStore();
      }
    },

    /* 只清除用户信息，保留缓存 */
    resetUserStore() {
      getPDSClient().logout();
      set(() => ({
        userInfo: undefined,
        userProfile: undefined,
        isWhiteListUser: false,
      }));
    },

    getUserProfile: async () => {
      const userInfo = get().userInfo;

      if (!userInfo) return;
      const result = await fetchUserProfile(userInfo.did);
      set(() => ({
        userProfile: { ...result, handle: userInfo.handle },
        isWhiteListUser: !!result.highlight,
      }));

      // 没有displayName说明需要补充写入profile
      if (!result.displayName) {
        const status = await get().writeProfile();
        if (status === "SUCCESS") {
          const profile = await fetchUserProfile(userInfo.did);
          set(() => ({ userProfile: profile }));
          return profile;
        }
      }

      return result;
    },

    // getSigningKey: (walletAddress) => {
    //   if (get().signingKey) {
    //     return get().signingKey;
    //   }
    //   const signingKeyMap = storage.getToken();
    //
    //   const key = signingKeyMap?.[walletAddress];
    //   if (key) {
    //     set(() => ({ signingKey: key }))
    //   }
    //   return key
    // },

    initialize: async () => {
      console.log("🚀 开始初始化用户信息store");
      await get().web5Login();

      let visitor = localStorage.getItem(STORAGE_VISITOR);
      if (!visitor) {
        const random4Digit = Math.floor(Math.random() * 9000) + 1000;
        visitor = random4Digit.toString();
        localStorage.setItem(STORAGE_VISITOR, visitor);
        console.log("👤 生成新的访客ID:", visitor);
      } else {
        console.log("👤 使用现有访客ID:", visitor);
      }

      set(() => ({ initialized: true, visitorId: visitor }));
      console.log("✅ 用户信息store初始化完成");
    },
  }))
);

export default useUserInfoStore;
