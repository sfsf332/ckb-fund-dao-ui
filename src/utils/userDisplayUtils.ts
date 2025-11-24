import { handleToNickName } from "@/lib/handleToNickName";
import type { UserProfileType } from "@/store/userInfo";
import type { ComAtprotoServerCreateSession } from "web5-api";

/**
 * 用户信息接口，用于获取用户显示名称
 */
export interface UserDisplayInfo {
  displayName?: string | null;
  handle?: string | null;
  did?: string | null;
}

/**
 * 获取用户显示名称的通用方法
 * 优先级：displayName > handleToNickName(handle) > 截取的 did
 * 
 * @param userInfo - 用户信息（可选，包含 handle 和 did）
 * @param userProfile - 用户资料（可选，包含 displayName）
 * @returns 用户显示名称
 */
export function getUserDisplayName(
  userInfo?: { handle?: string | null; did?: string | null } | null,
  userProfile?: { displayName?: string | null } | null
): string {
  // 优先使用 userProfile 的 displayName（如果存在且不为空）
  if (userProfile?.displayName && userProfile.displayName.trim()) {
    return userProfile.displayName;
  }
  
  // 如果有 handle，使用 handleToNickName 来显示用户名
  if (userInfo?.handle) {
    const nickName = handleToNickName(userInfo.handle);
    if (nickName) return nickName;
  }
  
  // 最后回退到 DID（截取显示）
  if (userInfo?.did) {
    const did = userInfo.did;
    if (did.length > 10) {
      return `${did.slice(0, 6)}...${did.slice(-4)}`;
    }
    return did;
  }
  
  return "";
}

/**
 * 从用户显示信息对象获取显示名称
 * 用于处理评论作者、回复对象等场景
 * 
 * @param userDisplayInfo - 用户显示信息对象（包含 displayName, handle, did）
 * @returns 用户显示名称
 */
export function getUserDisplayNameFromInfo(
  userDisplayInfo?: UserDisplayInfo | null
): string {
  if (!userDisplayInfo) return "";
  
  // 优先使用 displayName（如果存在且不为空）
  if (userDisplayInfo.displayName && userDisplayInfo.displayName.trim()) {
    return userDisplayInfo.displayName;
  }
  
  // 如果有 handle，使用 handleToNickName 来显示用户名
  if (userDisplayInfo.handle) {
    const nickName = handleToNickName(userDisplayInfo.handle);
    if (nickName) return nickName;
  }
  
  // 最后回退到 DID（截取显示）
  if (userDisplayInfo.did) {
    const did = userDisplayInfo.did;
    if (did.length > 10) {
      return `${did.slice(0, 6)}...${did.slice(-4)}`;
    }
    return did;
  }
  
  return "";
}

/**
 * 从 Zustand store 的用户信息获取显示名称
 * 这是一个便捷方法，用于在组件中直接使用
 * 
 * @param userInfo - Zustand store 的 userInfo
 * @param userProfile - Zustand store 的 userProfile
 * @returns 用户显示名称
 */
export function getUserDisplayNameFromStore(
  userInfo?: ComAtprotoServerCreateSession.OutputSchema | null,
  userProfile?: UserProfileType | null
): string {
  return getUserDisplayName(userInfo, userProfile);
}

