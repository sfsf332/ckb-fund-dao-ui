import React from 'react';
import ReactQuill from 'react-quill-new';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  index:number
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
  onMilestoneDateChange: (milestoneId: string, date: Date | null) => void;
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
  onMilestoneDateChange,
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
                          <DatePicker
                            selected={milestone.date ? new Date(milestone.date) : null}
                            onChange={(date) => onMilestoneDateChange(milestone.id, date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="请选择预计完成日期"
                            minDate={new Date()}
                            className="form-input"
                            showPopperArrow={false}
                            popperClassName="react-datepicker-popper"
                            calendarClassName="react-datepicker-calendar"
                            locale="zh-CN"
                            autoComplete="off"
                          />
                          <div className="select-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 13H8.01M12 13H12.01M16 13H16.01M8 17H8.01M12 17H12.01M16 17H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
