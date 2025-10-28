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
          onChange={onInputChange}
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
