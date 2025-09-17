import React from 'react';
import ReactQuill from 'react-quill-new';

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
  return (
    <div className="form-fields">
      <div>
        <label htmlFor="team" className="form-label">
          团队介绍:
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
                placeholder="请介绍团队成员、技能背景和相关经验"
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
              编辑器加载中...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamIntroduction;
