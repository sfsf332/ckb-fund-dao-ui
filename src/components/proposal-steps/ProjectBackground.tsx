import React from 'react';
import ReactQuill from 'react-quill-new';

interface ProjectBackgroundProps {
  formData: {
    background: string;
  };
  onInputChange: (value: string) => void;
  isClient: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quillModules: any;
  quillFormats: string[];
}

const ProjectBackground: React.FC<ProjectBackgroundProps> = ({ 
  formData, 
  onInputChange, 
  isClient, 
  quillModules, 
  quillFormats 
}) => {
  return (
    <div className="form-fields">
      <div>
        <label htmlFor="background" className="form-label">
          项目背景 *
        </label>
        <div className="editor-container">
          {isClient ? (
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={formData.background}
                onChange={onInputChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="请详细描述项目的背景、现状和需求"
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

export default ProjectBackground;
