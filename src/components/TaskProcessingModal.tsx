"use client";

import { useState } from "react";
import { MdCalendarToday, MdLocationOn } from "react-icons/md";

interface TaskProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: TaskFormData) => void;
  taskType?: TaskType;
}

interface TaskFormData {
  meetingTime: string;
  meetingLocation: string;
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
}

export type TaskType = 
  | "组织会议"
  | "组织AMA"
  | "发布会议纪要" 
  | "里程碑拨款"
  | "里程碑核查"
  | "项目整改核查"
  | "回收项目资金"
  | "发布结项报告";

export default function TaskProcessingModal({ 
  isOpen, 
  onClose, 
  onComplete,
  taskType = "组织会议"
}: TaskProcessingModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    meetingTime: "",
    meetingLocation: "",
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
    finalReport: ""
  });

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleComplete = () => {
    onComplete(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      meetingTime: "",
      meetingLocation: "",
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
      finalReport: ""
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
        <div className="modal-content">
          {/* 提案信息 */}
          <div className="proposal-info-section">
            <h3 className="section-title">提案信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">提案名称:</span>
                <span className="info-value">开放式数字资产协议——&ldquo;Aetherium Protocol&rdquo;</span>
              </div>
              <div className="info-item">
                <span className="info-label">提案类型:</span>
                <span className="info-value">项目预算申请</span>
              </div>
              <div className="info-item">
                <span className="info-label">提案阶段:</span>
                <span className="info-value">社区审议中</span>
              </div>
              <div className="info-item">
                <span className="info-label">申请预算:</span>
                <span className="info-value">5,000,000 CKB</span>
              </div>
            </div>
          </div>

          {/* 任务信息 */}
          <div className="task-info-section">
            <h3 className="section-title">任务信息</h3>
            
            <div className="form-grid">
              {/* 任务类型 */}
              <div className="form-item">
                <label className="form-label">任务类型</label>
                <div className="readonly-field">{taskType}</div>
              </div>

              {/* 截止时间 */}
              <div className="form-item">
                <label className="form-label">截止时间</label>
                <div className="readonly-field">2025/09/18 00:00 (UTC+8)</div>
              </div>

              {/* 根据任务类型显示不同的表单字段 */}
              {taskType === "组织会议" && (
                <>
                  {/* 会议时间和地点 - 并排显示 */}
                  <div className="form-row">
                    {/* 会议时间 */}
                    <div className="form-item">
                      <label className="form-label required">会议时间</label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          placeholder="请选择"
                          value={formData.meetingTime}
                          onChange={(e) => handleInputChange("meetingTime", e.target.value)}
                          className="form-input"
                        />
                        <MdCalendarToday className="input-icon" />
                      </div>
                    </div>

                    {/* 会议地点 */}
                    <div className="form-item">
                      <label className="form-label required">会议地点</label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          placeholder="请选择"
                          value={formData.meetingLocation}
                          onChange={(e) => handleInputChange("meetingLocation", e.target.value)}
                          className="form-input"
                        />
                        <MdLocationOn className="input-icon" />
                      </div>
                    </div>
                  </div>

                  {/* 会议链接 - 单独一行 */}
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
                  {/* 会议时间和地点 - 并排显示 */}
                  <div className="form-row">
                    {/* 会议时间 */}
                    <div className="form-item">
                      <label className="form-label required">会议时间</label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          placeholder="请选择"
                          value={formData.meetingTime}
                          onChange={(e) => handleInputChange("meetingTime", e.target.value)}
                          className="form-input"
                        />
                        <MdCalendarToday className="input-icon" />
                      </div>
                    </div>

                    {/* 会议地点 */}
                    <div className="form-item">
                      <label className="form-label required">会议地点</label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          placeholder="请选择"
                          value={formData.meetingLocation}
                          onChange={(e) => handleInputChange("meetingLocation", e.target.value)}
                          className="form-input"
                        />
                        <MdLocationOn className="input-icon" />
                      </div>
                    </div>
                  </div>

                  {/* 会议链接 - 单独一行 */}
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
                  <div className="rich-text-container">
                    <textarea
                      placeholder="请输入会议纪要内容"
                      value={formData.meetingMinutes}
                      onChange={(e) => handleInputChange("meetingMinutes", e.target.value)}
                      className="rich-textarea"
                      rows={6}
                    />
                    <div className="rich-text-toolbar">
                      <button type="button" className="toolbar-btn">😊</button>
                      <button type="button" className="toolbar-btn">B</button>
                      <button type="button" className="toolbar-btn">I</button>
                      <button type="button" className="toolbar-btn">U</button>
                      <button type="button" className="toolbar-btn">•</button>
                      <button type="button" className="toolbar-btn">1.</button>
                      <button type="button" className="toolbar-btn">📷</button>
                      <button type="button" className="toolbar-btn">🔗</button>
                      <button type="button" className="toolbar-btn">📎</button>
                    </div>
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
                      className="form-input"
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
                      className="form-input"
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
                    <div className="rich-text-container">
                      <textarea
                        placeholder="请输入结项报告内容"
                        value={formData.finalReport}
                        onChange={(e) => handleInputChange("finalReport", e.target.value)}
                        className="rich-textarea"
                        rows={6}
                      />
                      <div className="rich-text-toolbar">
                        <button type="button" className="toolbar-btn">😊</button>
                        <button type="button" className="toolbar-btn">B</button>
                        <button type="button" className="toolbar-btn">I</button>
                        <button type="button" className="toolbar-btn">U</button>
                        <button type="button" className="toolbar-btn">•</button>
                        <button type="button" className="toolbar-btn">1.</button>
                        <button type="button" className="toolbar-btn">📷</button>
                        <button type="button" className="toolbar-btn">🔗</button>
                        <button type="button" className="toolbar-btn">📎</button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 备注信息 */}
              <div className="form-item full-width">
                <label className="form-label">备注信息</label>
                <div className="rich-text-container">
                  <textarea
                    placeholder="请输入"
                    value={formData.remarks}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
                    className="rich-textarea"
                    rows={4}
                  />
                  {/* 富文本编辑器工具栏 */}
                  <div className="rich-text-toolbar">
                    <button type="button" className="toolbar-btn">😊</button>
                    <button type="button" className="toolbar-btn">B</button>
                    <button type="button" className="toolbar-btn">I</button>
                    <button type="button" className="toolbar-btn">U</button>
                    <button type="button" className="toolbar-btn">•</button>
                    <button type="button" className="toolbar-btn">1.</button>
                    <button type="button" className="toolbar-btn">📷</button>
                    <button type="button" className="toolbar-btn">🔗</button>
                    <button type="button" className="toolbar-btn">📎</button>
                  </div>
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
