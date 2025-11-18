import {
    mol,
    hexFrom,
    numFrom,
    Script,
  } from "@ckb-ccc/core";
import type {
    HexLike,
    Hex,
    NumLike,
    ScriptLike,
  } from "@ckb-ccc/core";
  
  
  // table BindInfo {
  //     from: Script,
  //     to: Script,
  //     timestamp: Uint64,
  // }
  export type BindInfoLike = {
    to: ScriptLike;
    timestamp: NumLike;
  };
  
  @mol.codec(
    mol.table({
      to: Script,
      timestamp: mol.Uint64,
    }),
  )
  
  export class BindInfo extends mol.Entity.Base<BindInfoLike, BindInfo>() {
    constructor(
      public to: ScriptLike,
      public timestamp: NumLike,
    ) {
      super();
    }
  
    static from(data: BindInfoLike): BindInfo {
      if (data instanceof BindInfo) {
        return data;
      }
      return new BindInfo(
        Script.from(data.to),
        numFrom(data.timestamp),
      );
    }
  }
  
  // table BindInfoWithSig {
  //     bind_info: BindInfo,
  //     sig: Bytes,
  // }
  
  export type BindInfoWithSigLike = {
    bind_info: BindInfoLike;
    sig: HexLike;
  };
  
  @mol.codec(
    mol.table({
      bind_info: BindInfo,
      sig: mol.Bytes,
    }),
  )
  export class BindInfoWithSig extends mol.Entity.Base<
    BindInfoWithSigLike,
    BindInfoWithSig
  >() {
    constructor(
      public bind_info: BindInfo,
      public sig: Hex,
    ) {
      super();
    }
  
    static from(data: BindInfoWithSigLike): BindInfoWithSig {
      if (data instanceof BindInfoWithSig) {
        return data;
      }
      return new BindInfoWithSig(
        BindInfo.from(data.bind_info),
        hexFrom(data.sig),
      );
    }
  }

  // table VoteProof {
  //     vote_script_hash: Byte32,
  //     user_smt_proof: BytesVec,
  // }
  export type VoteProofLike = {
    vote_script_hash: HexLike;
    user_smt_proof: HexLike[];
  };

  @mol.codec(
    mol.table({
      vote_script_hash: mol.Byte32,
      user_smt_proof: mol.BytesVec,
    }),
  )
  export class VoteProof extends mol.Entity.Base<VoteProofLike, VoteProof>() {
    constructor(
      public vote_script_hash: Hex,
      public user_smt_proof: Hex[],
    ) {
      super();
    }

    static from(data: VoteProofLike): VoteProof {
      if (data instanceof VoteProof) {
        return data;
      }
      return new VoteProof(
        hexFrom(data.vote_script_hash),
        data.user_smt_proof.map((p) => hexFrom(p)),
      );
    }
  }
  