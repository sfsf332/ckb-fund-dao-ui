import React from 'react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/contexts/I18nContext';

// 动态导入ReactQuill，禁用SSR
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

interface TeamIntroductionProps {
  formData: {
    team: string;
  };
  onInputChange: (value: string) => void;
  isClient: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quillModules: any;
  quillFormats: string[];
}

const TeamIntroduction: React.FC<TeamIntroductionProps> = ({ 
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
        <label htmlFor="team" className="form-label">
          {messages.proposalSteps.teamIntroduction.title}
        </label>
        <div className="editor-container">
          {isClient ? (
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={formData.team}
                onChange={onInputChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder={messages.proposalSteps.teamIntroduction.placeholder}
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
              {messages.proposalSteps.teamIntroduction.editorLoading}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamIntroduction;
