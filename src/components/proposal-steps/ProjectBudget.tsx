import React from 'react';

interface ProjectBudgetProps {
  formData: {
    budget: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProjectBudget: React.FC<ProjectBudgetProps> = ({ formData, onInputChange }) => {
  return (
    <div className="form-fields">
      <div>
        <label htmlFor="budget" className="form-label">
          项目预算 (CKB):
        </label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={onInputChange}
          className="form-input"
          placeholder="请输入项目预算金额"
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default ProjectBudget;
