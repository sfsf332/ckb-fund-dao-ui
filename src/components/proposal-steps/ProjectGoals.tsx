import React from 'react';
import ReactQuill from 'react-quill-new';
import { useI18n } from '@/contexts/I18nContext';

interface ProjectGoalsProps {
  formData: {
    goals: string;
  };
  onInputChange: (value: string) => void;
  isClient: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quillModules: any;
  quillFormats: string[];
}

const ProjectGoals: React.FC<ProjectGoalsProps> = ({ 
  formData, 
  onInputChange, 
  isClient, 
  quillModules, 
  quillFormats 
}) => {
  const { messages } = useI18n();
  
  return (
    <div className="form-fields">
      <div>
        <label htmlFor="goals" className="form-label">
          {messages.proposalSteps.projectGoals.title}
        </label>
        <div className="editor-container">
          {isClient ? (
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={formData.goals}
                onChange={onInputChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder={messages.proposalSteps.projectGoals.placeholder}
                style={{
                  height: "300px",
                  marginBottom: "10px",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                height: "300px",
                marginBottom: "50px",
                border: "1px solid #4C525C",
                borderRadius: "6px",
                backgroundColor: "#262A33",
                padding: "12px",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {messages.proposalSteps.projectGoals.editorLoading}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectGoals;
