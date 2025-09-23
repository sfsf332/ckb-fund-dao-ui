'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { SignatureModal, SuccessModal } from '../ui/modal';

interface WalletDaoCardProps {
  className?: string;
}

export default function WalletDaoCard({ className = '' }: WalletDaoCardProps) {
  const [votingPower] = useState('4,000,000');
  const [walletAddress] = useState('ckb1qyq...gjw');
  const [walletBalance] = useState('50,000');
  const [depositedInDao] = useState('2,000,000');
  const [redeeming] = useState('0');
  const [showNeuronDropdown, setShowNeuronDropdown] = useState(false);
  const [neuronWallets, setNeuronWallets] = useState([
    'ckb1qyq...gjw',
    'ckb1ikm...2x8',
    'ckb1klp...ti9'
  ]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [signatureMessage] = useState('vB7u09KpZT');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleStakeCKB = () => {
    // 处理质押CKB逻辑
    console.log('质押CKB');
  };

  const handleBindNeuron = () => {
    setShowNeuronDropdown(!showNeuronDropdown);
  };

  const handleBindNewWallet = () => {
    setShowNeuronDropdown(false);
    setShowSignatureModal(true);
  };

  const handleSignatureBind = (signature: string) => {
    console.log('绑定签名:', signature);
    setShowSignatureModal(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // 这里可以添加新钱包地址到列表
    const newWallet = `ckb1new...${Math.random().toString(36).substr(2, 4)}`;
    setNeuronWallets(prev => [...prev, newWallet]);
  };

  const handleRemoveWallet = (walletToRemove: string) => {
    setNeuronWallets(prev => prev.filter(wallet => wallet !== walletToRemove));
  };

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNeuronDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSwitchWallet = () => {
    // 处理切换钱包逻辑
    console.log('切换钱包');
  };

  return (
    <div className={`wallet-dao-card ${className}`}>
      <h3 className="card-title">钱包及 Nervos DAO</h3>
      
      <div className="voting-power-section">
        <div className="voting-power-header">
          <h4 className="voting-power-label">
            我的投票权
            <IoMdInformationCircleOutline data-tooltip-id="my-tooltip" data-tooltip-content="投票权的解释" />
          </h4>
        </div>
        <div className="voting-power-amount">{votingPower} CKB</div>
      </div>

      <div className="wallet-section">
        <div className="wallet-address-group">
          <label className="wallet-label">当前连接钱包</label>
          <div className="wallet-address-row">
            <span className="wallet-address">{walletAddress}</span>
            <button
              className="switch-wallet-button"
              onClick={handleSwitchWallet}
            >
              切换
            </button>
          </div>
        </div>

        <div className="wallet-balances">
          <div className="balance-item">
            <span className="balance-label">钱包余额:</span>
            <span className="balance-value">{walletBalance} CKB</span>
          </div>
          <div className="balance-item">
            <span className="balance-label">已存入Nervos DAO:</span>
            <span className="balance-value">{depositedInDao} CKB</span>
          </div>
          <div className="balance-item">
            <span className="balance-label">赎回中:</span>
            <span className="balance-value">{redeeming} CKB</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="action-button stake-button"
          onClick={handleStakeCKB}
        >
          <Image
            src="/nervos-logo-s.svg"
            alt="Nervos"
            width={16}
            height={16}
            className="button-icon"
          />
          质押CKB
        </button>
        
        <div className="neuron-dropdown-container" ref={dropdownRef}>
          <button
            className="action-button bind-button"
            onClick={handleBindNeuron}
          >
            <MdOutlineAccountBalanceWallet />
            绑定 Neuron 钱包地址
          </button>
          
          {showNeuronDropdown && (
            <div className="neuron-dropdown">
              <div className="neuron-dropdown-item" onClick={handleBindNewWallet}>
                绑定新钱包地址
              </div>
              {neuronWallets.map((wallet, index) => (
                <div key={index} className="neuron-wallet-item">
                  <span className="wallet-address">{wallet}</span>
                  <button
                    className="remove-wallet-button"
                    onClick={() => handleRemoveWallet(wallet)}
                  >
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 签名信息弹窗 */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onBind={handleSignatureBind}
        message={signatureMessage}
      />

      {/* 绑定成功弹窗 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        message="绑定成功!"
      />
    </div>
  );
}
