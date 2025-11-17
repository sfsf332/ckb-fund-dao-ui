import React from 'react';
import dynamic from 'next/dynamic';
import CustomDatePicker from '@/components/ui/DatePicker';
import { useI18n } from '@/contexts/I18nContext';

// 动态导入ReactQuill，禁用SSR
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

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
  const { messages } = useI18n();
  
  return (
    <div className="form-fields">
      <div>
        <label className="form-label">{messages.proposalSteps.projectMilestones.title}</label>

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
                  title={messages.proposalSteps.projectMilestones.removeMilestone}
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
              title={messages.proposalSteps.projectMilestones.addMilestone}
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
            <p>{messages.proposalSteps.projectMilestones.emptyMessage}</p>
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
                          {messages.proposalSteps.projectMilestones.milestoneTitle}
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
                          placeholder={messages.proposalSteps.projectMilestones.milestonePlaceholder}
                          required
                        />
                      </div>

                      <div className="milestone-field">
                        <label className="form-label">
                          {messages.proposalSteps.projectMilestones.expectedDate}
                        </label>
                        <CustomDatePicker
                          selected={milestone.date ? new Date(milestone.date) : null}
                          onChange={(date) => onMilestoneDateChange(milestone.id, date)}
                          placeholderText={messages.proposalSteps.projectMilestones.datePlaceholder}
                          minDate={new Date()}
                        />
                      </div>
                    </div>

                    <div className="milestone-field">
                      <label className="form-label">{messages.proposalSteps.projectMilestones.description}</label>
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
                              placeholder={messages.proposalSteps.projectMilestones.descriptionPlaceholder}
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
                            {messages.proposalSteps.projectMilestones.editorLoading}
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
