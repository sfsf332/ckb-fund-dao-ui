import React from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface ProjectBudgetProps {
  formData: {
    budget: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProjectBudget: React.FC<ProjectBudgetProps> = ({ formData, onInputChange }) => {
  const { messages } = useI18n();
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 允许空值（用于清空输入）
    if (value === '') {
      onInputChange(e);
      return;
    }
    
    // 检查是否为有效的正数
    const numValue = parseFloat(value);
    
    // 验证：必须是有效数字且大于0
    if (!isNaN(numValue) && numValue > 0 && isFinite(numValue)) {
      onInputChange(e);
    }
    // 如果输入无效（负数、0、或非数字），则不更新状态
  };
  
  return (
    <div className="form-fields">
      <div>
        <label htmlFor="budget" className="form-label">
          {messages.proposalSteps.projectBudget.title}
        </label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleBudgetChange}
          className="form-input"
          placeholder={messages.proposalSteps.projectBudget.placeholder}
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default ProjectBudget;
