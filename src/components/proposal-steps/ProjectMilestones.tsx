import React from 'react';
import ReactQuill from 'react-quill-new';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface ProjectMilestonesProps {
  formData: {
    milestones: Milestone[];
  };
  activeMilestoneIndex: number;
  setActiveMilestoneIndex: (index: number) => void;
  addMilestone: () => void;
  removeMilestone: (id: string) => void;
  updateMilestone: (id: string, field: string, value: string) => void;
  isClient: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quillModules: any;
  quillFormats: string[];
}

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({
  formData,
  activeMilestoneIndex,
  setActiveMilestoneIndex,
  addMilestone,
  removeMilestone,
  updateMilestone,
  isClient,
  quillModules,
  quillFormats,
}) => {
  return (
    <div className="form-fields">
      <div>
        <label className="form-label">项目里程碑:</label>

        <div className="milestones-tabs-container">
          <div className="milestones-tabs">
            {formData.milestones.map((milestone, index) => (
              <>
                <button
                  key={milestone.id}
                  type="button"
                  className={`milestone-tab ${
                    index === activeMilestoneIndex ? "active" : ""
                  }`}
                  onClick={() => setActiveMilestoneIndex(index)}
                >
                  {milestone.title || `里程碑${index + 1}`}{" "}
                </button>
                <button
                  type="button"
                  onClick={() => removeMilestone(milestone.id)}
                  className="milestone-remove-btn"
                  title="删除里程碑"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </>
            ))}
            <button
              type="button"
              onClick={addMilestone}
              className="milestone-add-btn"
              title="添加新里程碑"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {formData.milestones.length === 0 ? (
          <div className="milestones-empty">
            <p>还没有添加任何里程碑，点击+按钮开始添加。</p>
          </div>
        ) : (
          <div className="milestones-content">
            {formData.milestones.map(
              (milestone, index) =>
                index === activeMilestoneIndex && (
                  <div
                    key={milestone.id}
                    className="milestone-panel active"
                  >
                    <div className="milestone-panel-fields">
                      <div className="milestone-field">
                        <label className="form-label">
                          里程碑标题:
                        </label>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) =>
                            updateMilestone(
                              milestone.id,
                              "title",
                              e.target.value
                            )
                          }
                          className="form-input"
                          placeholder="例如：项目启动、第一阶段完成、产品发布等"
                          required
                        />
                      </div>

                      <div className="milestone-field">
                        <label className="form-label">
                          预计完成日期:
                        </label>
                        <div className="input-container">
                          <input
                            type="date"
                            value={milestone.date}
                            onChange={(e) =>
                              updateMilestone(
                                milestone.id,
                                "date",
                                e.target.value
                              )
                            }
                            className="form-input"
                            required
                          />
                          <div className="select-arrow">
                            <svg
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="milestone-field">
                      <label className="form-label">详细描述:</label>
                      <div className="editor-container">
                        {isClient ? (
                          <div className="quill-wrapper">
                            <ReactQuill
                              theme="snow"
                              value={milestone.description}
                              onChange={(value) =>
                                updateMilestone(
                                  milestone.id,
                                  "description",
                                  value
                                )
                              }
                              modules={quillModules}
                              formats={quillFormats}
                              placeholder="请详细描述这个里程碑的具体内容、交付物和验收标准"
                              style={{
                                height: "200px",
                                marginBottom: "20px",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              height: "200px",
                              marginBottom: "20px",
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
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMilestones;
