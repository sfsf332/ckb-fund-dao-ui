import React from 'react';
import ReactQuill from 'react-quill-new';

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
  return (
    <div className="form-fields">
      <div>
        <label htmlFor="goals" className="form-label">
          项目目标:
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
                placeholder="请详细描述项目的目标、预期成果和成功指标"
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

export default ProjectGoals;
