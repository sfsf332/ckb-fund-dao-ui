"use client";

import { useState, useEffect } from "react";
import { ProposalStatus } from "@/utils/proposalUtils";
import { formatNumber } from "@/utils/proposalUtils";
import { useCreateVoteMeta } from "@/hooks/useCreateVoteMeta";
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

export type TaskType = 
  | "组织会议"
  | "组织AMA"
  | "发布会议纪要" 
  | "里程碑拨款"
  | "里程碑核查"
  | "项目整改核查"
  | "回收项目资金"
  | "发布结项报告"
  | "创建投票";

// 提案状态映射函数
const getStatusText = (status: ProposalStatus): string => {
  switch (status) {
    case ProposalStatus.DRAFT:
      return "草稿";
    case ProposalStatus.REVIEW:
      return "社区审议中";
    case ProposalStatus.VOTE:
      return "投票中";
    case ProposalStatus.MILESTONE:
      return "里程碑交付中";
    case ProposalStatus.APPROVED:
      return "已通过";
    case ProposalStatus.REJECTED:
      return "已拒绝";
    case ProposalStatus.ENDED:
      return "结束";
    default:
      return "未知状态";
  }
};

export default function TaskProcessingModal({ 
  isOpen, 
  onClose, 
  onComplete,
  taskType = "组织会议",
  proposal
}: TaskProcessingModalProps) {
  const [isClient, setIsClient] = useState(false);
  const { createReviewVote, error: voteError } = useCreateVoteMeta();
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
    if (taskType === "创建投票" && proposal) {
      // 处理投票创建
      if (formData.useCustomTime) {
        if (!formData.customStartTime || !formData.customEndTime) {
          alert("请选择投票开始和结束时间");
          return;
        }
      }

      const result = await createReviewVote(proposal.uri);
      
      if (result.success) {
        onComplete(formData);
        onClose();
      } else {
        alert(`创建投票失败: ${result.error}`);
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
          <h2 className="modal-title">任务处理</h2>
        </div>

        {/* Modal内容 */}
        <div className="modal-content" style={{ maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
          {/* 提案信息 */}
          <div className="proposal-info-section">
            <h3 className="section-title">提案信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">提案名称:</span>
                <span className="info-value">{proposal?.name || "未知提案"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">提案ID:</span>
                <span className="info-value">{proposal?.id || "未知ID"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">提案类型:</span>
                <span className="info-value">{proposal?.type || "未知类型"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">提案阶段:</span>
                <span className="info-value">{proposal ? getStatusText(proposal.status) : "未知状态"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">申请预算:</span>
                <span className="info-value">{proposal?.budget ? `${formatNumber(proposal.budget)} CKB` : "未知预算"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">提案URI:</span>
                <span className="info-value uri-value">{proposal?.uri || "未知URI"}</span>
              </div>
            </div>
          </div>

          {/* 任务信息 */}
          <div className="task-info-section">
            <h3 className="section-title">任务信息</h3>
            
            <div className="form-grid">
              {/* 任务类型和截止时间 - 两列布局 */}
              <div className="form-row">
                <div className="form-item">
                  <label className="form-label">任务类型</label>
                  <div className="readonly-field">{taskType}</div>
                </div>
                <div className="form-item">
                  <label className="form-label">截止时间</label>
                  <div className="readonly-field">{proposal?.deadline || "待定"}</div>
                </div>
              </div>

              {/* 根据任务类型显示不同的表单字段 */}
              {taskType === "组织会议" && (
                <>
                  {/* 会议时间 */}
                  <div className="form-item">
                    <label className="form-label required">会议时间</label>
                    <div className="input-container">
                      <DatePicker
                        selected={formData.meetingTime}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="请选择会议时间"
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
                    <label className="form-label">会议链接</label>
                    <input
                      type="text"
                      placeholder="请输入"
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
                    <label className="form-label required">会议时间</label>
                    <div className="input-container">
                      <DatePicker
                        selected={formData.meetingTime}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="请选择会议时间"
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
                    <label className="form-label">会议链接</label>
                    <input
                      type="text"
                      placeholder="请输入"
                      value={formData.meetingLink}
                      onChange={(e) => handleInputChange("meetingLink", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </>
              )}

              {taskType === "发布会议纪要" && (
                <div className="form-item full-width">
                  <label className="form-label required">会议纪要</label>
                  <div className="editor-container">
                    {isClient ? (
                      <div className="quill-wrapper">
                        <ReactQuill
                          theme="snow"
                          value={formData.meetingMinutes}
                          onChange={(value) => handleInputChange("meetingMinutes", value)}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="请输入会议纪要内容"
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
                        编辑器加载中...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {taskType === "里程碑拨款" && (
                <>
                  <div className="form-item">
                    <label className="form-label required">拨款金额</label>
                    <input
                      type="text"
                      placeholder="请输入拨款金额"
                      value={formData.milestoneAmount}
                      onChange={(e) => handleInputChange("milestoneAmount", e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">拨款说明</label>
                    <textarea
                      placeholder="请输入拨款说明"
                      value={formData.milestoneDescription}
                      onChange={(e) => handleInputChange("milestoneDescription", e.target.value)}
                      className="form-input"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {taskType === "里程碑核查" && (
                <>
                  <div className="form-item">
                    <label className="form-label required">核查结果</label>
                    <select
                      value={formData.verificationResult}
                      onChange={(e) => handleInputChange("verificationResult", e.target.value)}
                      className="form-select"
                    >
                      <option value="">请选择</option>
                      <option value="通过">通过</option>
                      <option value="不通过">不通过</option>
                      <option value="需要整改">需要整改</option>
                    </select>
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">核查意见</label>
                    <textarea
                      placeholder="请输入核查意见"
                      value={formData.verificationNotes}
                      onChange={(e) => handleInputChange("verificationNotes", e.target.value)}
                      className="form-input"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {taskType === "项目整改核查" && (
                <>
                  <div className="form-item">
                    <label className="form-label required">整改状态</label>
                    <select
                      value={formData.rectificationStatus}
                      onChange={(e) => handleInputChange("rectificationStatus", e.target.value)}
                      className="form-select"
                    >
                      <option value="">请选择</option>
                      <option value="已完成">已完成</option>
                      <option value="进行中">进行中</option>
                      <option value="未开始">未开始</option>
                    </select>
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">整改说明</label>
                    <textarea
                      placeholder="请输入整改说明"
                      value={formData.rectificationNotes}
                      onChange={(e) => handleInputChange("rectificationNotes", e.target.value)}
                      className="form-input"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {taskType === "回收项目资金" && (
                <>
                  <div className="form-item">
                    <label className="form-label required">回收金额</label>
                    <input
                      type="text"
                      placeholder="请输入回收金额"
                      value={formData.recoveryAmount}
                      onChange={(e) => handleInputChange("recoveryAmount", e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">回收原因</label>
                    <textarea
                      placeholder="请输入回收原因"
                      value={formData.recoveryReason}
                      onChange={(e) => handleInputChange("recoveryReason", e.target.value)}
                      className="form-input"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {taskType === "发布结项报告" && (
                <>
                  <div className="form-item full-width">
                    <label className="form-label required">项目总结</label>
                    <textarea
                      placeholder="请输入项目总结"
                      value={formData.projectSummary}
                      onChange={(e) => handleInputChange("projectSummary", e.target.value)}
                      className="form-input"
                      rows={3}
                    />
                  </div>
                  <div className="form-item full-width">
                    <label className="form-label required">结项报告</label>
                    <div className="editor-container">
                      {isClient ? (
                        <div className="quill-wrapper">
                          <ReactQuill
                            theme="snow"
                            value={formData.finalReport}
                            onChange={(value) => handleInputChange("finalReport", value)}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="请输入结项报告内容"
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
                          编辑器加载中...
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {taskType === "创建投票" && (
                <>
                  {/* 投票类型和投票持续时间 - 两列布局 */}
                  <div className="form-row">
                    <div className="form-item">
                      <label className="form-label required">投票类型</label>
                      <select
                        value={formData.voteType}
                        onChange={(e) => handleInputChange("voteType", e.target.value)}
                        className="form-select"
                      >
                        <option value={1}>社区审议投票</option>
                        <option value={2}>正式投票</option>
                        <option value={3}>里程碑投票</option>
                      </select>
                    </div>
                    {!formData.useCustomTime && (
                      <div className="form-item">
                        <label className="form-label required">投票持续时间</label>
                        <select
                          value={formData.voteDuration}
                          onChange={(e) => handleInputChange("voteDuration", e.target.value)}
                          className="form-select"
                        >
                          <option value={1}>1天</option>
                          <option value={3}>3天</option>
                          <option value={7}>7天</option>
                          <option value={14}>14天</option>
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
                      自定义投票时间
                    </label>
                  </div>

                  {/* 时间预览 */}
                  {!formData.useCustomTime && (
                    <div className="form-item full-width">
                      <div className="time-preview">
                        <p>
                          投票开始时间: {new Date().toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Shanghai'
                          })} (UTC+8)
                        </p>
                        <p>
                          投票结束时间: {new Date(Date.now() + formData.voteDuration * 24 * 60 * 60 * 1000).toLocaleString('zh-CN', {
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
                        <label className="form-label required">投票开始时间</label>
                        <div className="input-container">
                          <DatePicker
                            selected={formData.customStartTime}
                            onChange={handleVoteStartDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="请选择投票开始时间"
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
                        <label className="form-label required">投票结束时间</label>
                        <div className="input-container">
                          <DatePicker
                            selected={formData.customEndTime}
                            onChange={handleVoteEndDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="请选择投票结束时间"
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
                <label className="form-label">备注信息</label>
                <div className="editor-container">
                  {isClient ? (
                    <div className="quill-wrapper">
                      <ReactQuill
                        theme="snow"
                        value={formData.remarks}
                        onChange={(value) => handleInputChange("remarks", value)}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="请输入"
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
                      编辑器加载中...
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
            完成
          </button>
          <button 
            className="btn-close"
            onClick={handleClose}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
