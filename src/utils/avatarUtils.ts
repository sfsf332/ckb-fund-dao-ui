/**
 * 根据用户DID的最后一位数字选择对应的头像
 * @param did 用户的DID字符串
 * @returns 对应的头像路径
 */
export function getAvatarByDid(did: string): string {
  if (!did) {
    return '/avatar/avatar-0.svg';
  }
  
  // 获取DID字符串的最后一位数字
  const lastChar = did.slice(-1);
  const lastDigit = parseInt(lastChar, 10);
  
  // 如果最后一位不是数字，使用0
  if (isNaN(lastDigit)) {
    return '/avatar/avatar-0.svg';
  }
  
  // 确保数字在0-9范围内
  const avatarIndex = lastDigit % 10;
  
  return `/avatar/avatar-${avatarIndex}.svg`;
}

/**
 * 获取默认头像
 * @returns 默认头像路径
 */
export function getDefaultAvatar(): string {
  return '/avatar/avatar-0.svg';
}
