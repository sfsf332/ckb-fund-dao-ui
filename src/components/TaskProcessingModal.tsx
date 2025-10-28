"use client";

import { useState, useEffect } from "react";
import { ProposalStatus } from "@/utils/proposalUtils";
import { formatNumber } from "@/utils/proposalUtils";
import { useCreateVoteMeta } from "@/hooks/useCreateVoteMeta";
import { useTranslation } from "@/utils/i18n";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface ProposalItem {
  id: string;
  name: string;
  type: string;
  status: ProposalStatus;
  taskType: TaskType;
  deadline: string;
  isNew?: boolean;
  progress?: string;
  uri: string;
  budget?: number; // 添加预算字段
}

interface TaskProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: TaskFormData) => void;
  taskType?: TaskType;
  proposal?: ProposalItem; // 添加提案数据
}

interface TaskFormData {
  meetingTime: Date | null; // 改为Date类型
  meetingLink: string;
  remarks: string;
  // 发布会议纪要相关
  meetingMinutes: string;
  // 里程碑拨款相关
  milestoneAmount: string;
  milestoneDescription: string;
  // 里程碑核查相关
  verificationResult: string;
  verificationNotes: string;
  // 项目整改核查相关
  rectificationStatus: string;
  rectificationNotes: string;
  // 回收项目资金相关
  recoveryAmount: string;
  recoveryReason: string;
  // 发布结项报告相关
  projectSummary: string;
  finalReport: string;
  // 创建投票相关
  voteType: number;
  voteDuration: number;
  customStartTime: Date | null;
  customEndTime: Date | null;
  useCustomTime: boolean;
}

export type TaskType = string;

// 获取任务类型翻译文本
const getTaskTypeText = (taskType: TaskType): string => {
  // 直接返回翻译后的文本，因为 taskType 现在已经是翻译后的文本
  return taskType;
};

// 检查任务类型是否匹配
const isTaskType = (currentTaskType: TaskType, targetTaskType: string, t: (key: string) => string): boolean => {
  return currentTaskType === t(targetTaskType);
};

// 提案状态映射函数
const getStatusText = (status: ProposalStatus, t: (key: string) => string): string => {
  switch (status) {
    case ProposalStatus.DRAFT:
      return t("proposalStatus.draft");
    case ProposalStatus.REVIEW:
      return t("proposalStatus.communityReview");
    case ProposalStatus.VOTE:
      return t("proposalStatus.voting");
    case ProposalStatus.MILESTONE:
      return t("proposalStatus.milestoneDelivery");
    case ProposalStatus.APPROVED:
      return t("proposalStatus.approved");
    case ProposalStatus.REJECTED:
      return t("proposalStatus.rejected");
    case ProposalStatus.ENDED:
      return t("proposalStatus.ended");
    default:
      return t("proposalStatus.unknown");
  }
};

export default function TaskProcessingModal({ 
  isOpen, 
  onClose, 
  onComplete,
  taskType = "",
  proposal
}: TaskProcessingModalProps) {
  const [isClient, setIsClient] = useState(false);
  const { createReviewVote, error: voteError } = useCreateVoteMeta();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<TaskFormData>({
    meetingTime: null, // 改为null
    meetingLink: "",
    remarks: "",
    meetingMinutes: "",
    milestoneAmount: "",
    milestoneDescription: "",
    verificationResult: "",
    verificationNotes: "",
    rectificationStatus: "",
    rectificationNotes: "",
    recoveryAmount: "",
    recoveryReason: "",
    projectSummary: "",
    finalReport: "",
    // 创建投票相关
    voteType: 1,
    voteDuration: 3,
    customStartTime: null,
    customEndTime: null,
    useCustomTime: false
  });

  // Quill 编辑器配置
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "blockquote",
    "code-block",
    "link",
    "image",
    "color",
    "background",
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      meetingTime: date
    }));
  };

  const handleVoteStartDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      customStartTime: date
    }));
  };

  const handleVoteEndDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      customEndTime: date
    }));
  };

  const handleComplete = async () => {
    if (isTaskType(taskType, "taskTypes.createVote", t) && proposal) {
      // 处理投票创建
      if (formData.useCustomTime) {
        if (!formData.customStartTime || !formData.customEndTime) {
          alert(t("alerts.selectVoteTime"));
          return;
        }
      }

      const result = await createReviewVote(proposal.uri);
      
      if (result.success) {
        onComplete(formData);
        onClose();
      } else {
        alert(`${t("alerts.createVoteFailed")}: ${result.error}`);
      }
    } else {
      // 处理其他任务类型
      onComplete(formData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      meetingTime: null, // 改为null
      meetingLink: "",
      remarks: "",
      meetingMinutes: "",
      milestoneAmount: "",
      milestoneDescription: "",
      verificationResult: "",
      verificationNotes: "",
      rectificationStatus: "",
      rectificationNotes: "",
      recoveryAmount: "",
      recoveryReason: "",
      projectSummary: "",
      finalReport: "",
      // 创建投票相关
      voteType: 1,
      voteDuration: 3,
      customStartTime: null,
      customEndTime: null,
      useCustomTime: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="task-processing-modal">
        {/* Modal标题 */}
        <div className="modal-header">
          <h2 className="modal-title">{t("taskModal.title")}</h2>
        </div>

        {/* Modal内容 */}
        <div className="modal-content" style={{ maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
          {/* 提案信息 */}
          <div className="proposal-info-section">
            <h3 className="section-title">{t("taskModal.proposalInfo")}</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">{t("proposalInfo.proposalName")}:</span>
                <span className="info-value">{proposal?.name || t("proposalInfo.unknownProposal")}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{t("proposalInfo.proposalId")}:</span>
                <span className="info-value">{proposal?.id || t("proposalInfo.unknownId")}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{t("proposalInfo.proposalType")}:</span>
                <span className="info-value">{proposal?.type || t("proposalInfo.unknownType")}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{t("proposalInfo.proposalPhase")}:</span>
                <span className="info-value">{proposal ? getStatusText(proposal.status, t) : t("proposalInfo.unknownStatus")}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{t("proposalInfo.budget")}:</span>
                <span className="info-value">{proposal?.budget ? `${formatNumber(proposal.budget)} CKB` : t("proposalInfo.unknownBudget")}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{t("proposalInfo.proposalUri")}:</span>
                <span className="info-value uri-value">{proposal?.uri || t("proposalInfo.unknownUri")}</span>
              </div>
            </div>
          </div>

          {/* 任务信息 */}
          <div className="task-info-section">
            <h3 className="section-title">{t("taskModal.taskInfo")}</h3>
            
            <div className="form-grid">
              {/* 任务类型和截止时间 - 两列布局 */}
              <div className="form-row">
                <div className="form-item">
                  <label className="form-label">{t("taskModal.taskType")}</label>
                  <div className="readonly-field">{getTaskTypeText(taskType)}</div>
                </div>
                <div className="form-item">
                  <label className="form-label">{t("taskModal.deadline")}</label>
                  <div className="readonly-field">{proposal?.deadline || t("proposalInfo.pending")}</div>
                </div>
              </div>

              {/* 根据任务类型显示不同的表单字段 */}
              {isTaskType(taskType, "taskTypes.organizeMeeting", t) && (
                <>
                  {/* 会议时间 */}
                  <div className="form-item">
                    <label className="form-label required">{t("formLabels.meetingTime")}</label>
                    <div className="input-container">
                      <DatePicker
                        selected={formData.meetingTime}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText={t("placeholders.selectMeetingTime")}
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

                  {/* 会议链接 */}
                  <div className="form-item full-width">
                    <label className="form-label">{t("formLabels.meetingLink")}</label>
                    <input
                      type="text"
                      placeholder={t("placeholders.enterMeetingLink")}
                      value={formData.meetingLink}
                      onChange={(e) => handleInputChange("meetingLink", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </>
              )}

              {taskType === "组织AMA" && (
                <>
                  {/* 会议时间 */}
                  <div className="form-item">
                    <label className="form-label required">{t("formLabels.meetingTime")}</label>
                    <div className="input-container">
                      <DatePicker
                        selected={formData.meetingTime}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText={t("placeholders.selectMeetingTime")}
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

                  {/* 会议链接 */}
                  <div className="form-item full-width">
                    <label className="form-label">{t("formLabels.meetingLink")}</label>
                    <input
                      type="text"
                      placeholder={t("placeholders.enterMeetingLink")}
                      value={formData.meetingLink}
                      onChange={(e) => handleInputChange("meetingLink", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </>
              )}

              {isTaskType(taskType, "taskTypes.publishMinutes", t) && (
                <div className="form-item full-width">
                  <label className="form-label required">{t("formLabels.meetingMinutes")}</label>
                  <div className="editor-container">
                    {isClient ? (
                      <div className="quill-wrapper">
                        <ReactQuill
                          theme="snow"
                          value={formData.meetingMinutes}
                          onChange={(value) => handleInputChange("meetingMinutes", value)}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder={t("placeholders.enterMeetingMinutes")}
                          style={{
                            height: "200px",
                            marginBottom: "10px",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          height: "200px",
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
                        {t("editor.loading")}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isTaskType(taskType, "taskTypes.milestoneAllocation", t) && (
                <>
                  <div className="form-item">
                    <label className="form-label required">{t("formLabels.allocationAmount")}</label>
                    <input
                      type="text"
                      placeholder={t("placeholders.enterAllocationAmount")}
                      value={formData.milestoneAmount}
                      onChange={(e) => handleInputChange("milestoneAmount", e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">{t("formLabels.allocationDescription")}</label>
                    <textarea
                      placeholder={t("placeholders.enterAllocationDescription")}
                      value={formData.milestoneDescription}
                      onChange={(e) => handleInputChange("milestoneDescription", e.target.value)}
                      className="form-input"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {isTaskType(taskType, "taskTypes.milestoneVerification", t) && (
                <>
                  <div className="form-item">
                    <label className="form-label required">{t("formLabels.verificationResult")}</label>
                    <select
                      value={formData.verificationResult}
                      onChange={(e) => handleInputChange("verificationResult", e.target.value)}
                      className="form-select"
                    >
                      <option value="">{t("placeholders.selectVerificationResult")}</option>
                      <option value={t("verificationResults.pass")}>{t("taskModal.verificationResults.pass")}</option>
                      <option value={t("verificationResults.fail")}>{t("taskModal.verificationResults.fail")}</option>
                      <option value={t("verificationResults.needRectification")}>{t("taskModal.verificationResults.needRectification")}</option>
                    </select>
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">{t("formLabels.verificationNotes")}</label>
                    <textarea
                      placeholder={t("placeholders.enterVerificationNotes")}
                      value={formData.verificationNotes}
                      onChange={(e) => handleInputChange("verificationNotes", e.target.value)}
                      className="form-input"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {isTaskType(taskType, "taskTypes.projectRectification", t) && (
                <>
                  <div className="form-item">
                    <label className="form-label required">{t("formLabels.rectificationStatus")}</label>
                    <select
                      value={formData.rectificationStatus}
                      onChange={(e) => handleInputChange("rectificationStatus", e.target.value)}
                      className="form-select"
                    >
                      <option value="">{t("placeholders.selectRectificationStatus")}</option>
                      <option value={t("rectificationStatuses.completed")}>{t("taskModal.rectificationStatuses.completed")}</option>
                      <option value={t("rectificationStatuses.inProgress")}>{t("taskModal.rectificationStatuses.inProgress")}</option>
                      <option value={t("rectificationStatuses.notStarted")}>{t("taskModal.rectificationStatuses.notStarted")}</option>
                    </select>
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">{t("formLabels.rectificationNotes")}</label>
                    <textarea
                      placeholder={t("placeholders.enterRectificationNotes")}
                      value={formData.rectificationNotes}
                      onChange={(e) => handleInputChange("rectificationNotes", e.target.value)}
                      className="form-input"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {isTaskType(taskType, "taskTypes.recoverFunds", t) && (
                <>
                  <div className="form-item">
                    <label className="form-label required">{t("formLabels.recoveryAmount")}</label>
                    <input
                      type="text"
                      placeholder={t("placeholders.enterRecoveryAmount")}
                      value={formData.recoveryAmount}
                      onChange={(e) => handleInputChange("recoveryAmount", e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">{t("formLabels.recoveryReason")}</label>
                    <textarea
                      placeholder={t("placeholders.enterRecoveryReason")}
                      value={formData.recoveryReason}
                      onChange={(e) => handleInputChange("recoveryReason", e.target.value)}
                      className="form-input"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {isTaskType(taskType, "taskTypes.publishReport", t) && (
                <>
                  <div className="form-item full-width">
                    <label className="form-label required">{t("formLabels.projectSummary")}</label>
                    <textarea
                      placeholder={t("placeholders.enterProjectSummary")}
                      value={formData.projectSummary}
                      onChange={(e) => handleInputChange("projectSummary", e.target.value)}
                      className="form-input"
                      rows={3}
                    />
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">{t("formLabels.finalReport")}</label>
                    <div className="editor-container">
                      {isClient ? (
                        <div className="quill-wrapper">
                          <ReactQuill
                            theme="snow"
                            value={formData.finalReport}
                            onChange={(value) => handleInputChange("finalReport", value)}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder={t("placeholders.enterFinalReport")}
                            style={{
                              height: "200px",
                              marginBottom: "10px",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: "200px",
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
                          {t("editor.loading")}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {isTaskType(taskType, "taskTypes.createVote", t) && (
                <>
                  {/* 投票类型和投票持续时间 - 两列布局 */}
                  <div className="form-row">
                    <div className="form-item">
                      <label className="form-label required">{t("taskModal.voteType")}</label>
                      <select
                        value={formData.voteType}
                        onChange={(e) => handleInputChange("voteType", e.target.value)}
                        className="form-select"
                      >
                        <option value={1}>{t("taskModal.voteTypes.communityReview")}</option>
                        <option value={2}>{t("taskModal.voteTypes.formal")}</option>
                        <option value={3}>{t("taskModal.voteTypes.milestone")}</option>
                      </select>
                    </div>
                    {!formData.useCustomTime && (
                      <div className="form-item">
                        <label className="form-label required">{t("taskModal.voteDuration")}</label>
                        <select
                          value={formData.voteDuration}
                          onChange={(e) => handleInputChange("voteDuration", e.target.value)}
                          className="form-select"
                        >
                          <option value={1}>{t("taskModal.durations.1day")}</option>
                          <option value={3}>{t("taskModal.durations.3days")}</option>
                          <option value={7}>{t("taskModal.durations.7days")}</option>
                          <option value={14}>{t("taskModal.durations.14days")}</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* 自定义时间选项 */}
                  <div className="form-item">
                    <label className="form-label">
                      <input
                        type="checkbox"
                        checked={formData.useCustomTime}
                        onChange={(e) => handleInputChange("useCustomTime", e.target.checked.toString())}
                        style={{ marginRight: "8px" }}
                      />
                      {t("taskModal.customVoteTime")}
                    </label>
                  </div>

                  {/* 时间预览 */}
                  {!formData.useCustomTime && (
                    <div className="form-item full-width">
                      <div className="time-preview">
                        <p>
                          {t("taskModal.timePreview.startTime")}: {new Date().toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Shanghai'
                          })} (UTC+8)
                        </p>
                        <p>
                          {t("taskModal.timePreview.endTime")}: {new Date(Date.now() + formData.voteDuration * 24 * 60 * 60 * 1000).toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Shanghai'
                          })} (UTC+8)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 自定义时间输入 - 两列布局 */}
                  {formData.useCustomTime && (
                    <div className="form-row">
                      <div className="form-item">
                        <label className="form-label required">{t("taskModal.voteStartTime")}</label>
                        <div className="input-container">
                          <DatePicker
                            selected={formData.customStartTime}
                            onChange={handleVoteStartDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText={t("taskModal.placeholders.selectVoteStartTime")}
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
                      <div className="form-item">
                        <label className="form-label required">{t("taskModal.voteEndTime")}</label>
                        <div className="input-container">
                          <DatePicker
                            selected={formData.customEndTime}
                            onChange={handleVoteEndDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText={t("taskModal.placeholders.selectVoteEndTime")}
                            minDate={formData.customStartTime || new Date()}
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
                  )}

                  {voteError && (
                    <div className="error-message">
                      {voteError}
                    </div>
                  )}
                </>
              )}

              {/* 备注信息 */}
              <div className="form-item full-width">
                <label className="form-label">{t("taskModal.remarks")}</label>
                <div className="editor-container">
                  {isClient ? (
                    <div className="quill-wrapper">
                      <ReactQuill
                        theme="snow"
                        value={formData.remarks}
                        onChange={(value) => handleInputChange("remarks", value)}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder={t("placeholders.enterMeetingLink")}
                        style={{
                          height: "150px",
                          marginBottom: "10px",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "150px",
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
                      {t("editor.loading")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal底部按钮 */}
        <div className="modal-footer">
          <button 
            className="btn-complete"
            onClick={handleComplete}
          >
            {t("taskModal.buttons.complete")}
          </button>
          <button 
            className="btn-close"
            onClick={handleClose}
          >
            {t("taskModal.buttons.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
