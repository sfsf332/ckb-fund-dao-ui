"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../../../utils/i18n";
import "./create-proposal.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import "react-quill-new/dist/quill.snow.css";
import PreviewModal from "@/components/PreviewModal";
import ProposalSettings from "@/components/proposal-steps/ProposalSettings";
import ProjectBackground from "@/components/proposal-steps/ProjectBackground";
import ProjectGoals from "@/components/proposal-steps/ProjectGoals";
import TeamIntroduction from "@/components/proposal-steps/TeamIntroduction";
import ProjectBudget from "@/components/proposal-steps/ProjectBudget";
import ProjectMilestones from "@/components/proposal-steps/ProjectMilestones";
import { writesPDSOperation } from "@/app/posts/utils";
import useUserInfoStore from "@/store/userInfo";
import { useI18n } from "@/contexts/I18nContext";

const steps = [
  { id: 1, name: "提案设置", description: "基本设置信息" },
  { id: 2, name: "项目背景", description: "项目背景介绍" },
  { id: 3, name: "项目目标", description: "项目目标规划" },
  { id: 4, name: "团队介绍", description: "团队信息介绍" },
  { id: 5, name: "项目预算", description: "预算规划设置" },
  { id: 6, name: "里程碑", description: "项目里程碑规划" },
];

export default function CreateProposal() {
  useTranslation();
  
  const router = useRouter();
  const { locale } = useI18n();
  const { userInfo } = useUserInfoStore();
  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    proposalType: "",
    title: "",
    releaseDate: "",
    background: "",
    goals: "",
    team: "",
    budget: "",
    milestones: [] as Array<{
      id: string;
      index: number;
      title: string;
      description: string;
      date: string;
    }>,
  });

  useEffect(() => {
    setIsClient(true);
    // 加载草稿
    loadDraft();
  }, []);

  // 草稿保存和加载功能
  const DRAFT_KEY = 'proposal_draft';

  const saveDraft = useCallback(async (data: typeof formData) => {
    try {
      setIsDraftSaving(true);
      const draftData = {
        ...data,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      setLastSaved(new Date());
    } catch (error) {
      console.error('保存草稿失败:', error);
    } finally {
      setIsDraftSaving(false);
    }
  }, []);

  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        // 移除savedAt字段，只保留表单数据
        const { savedAt, ...formDataFromDraft } = draftData;
        setFormData(formDataFromDraft);
        setLastSaved(new Date(draftData.savedAt));
      }
    } catch (error) {
      console.error('加载草稿失败:', error);
    }
  }, []);

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setLastSaved(null);
    } catch (error) {
      console.error('删除草稿失败:', error);
    }
  };

  // 自动保存功能
  useEffect(() => {
    if (!isClient) return;

    const timeoutId = setTimeout(() => {
      // 检查表单是否有内容
      const hasContent = formData.title || 
                        formData.background || 
                        formData.goals || 
                        formData.team || 
                        formData.budget || 
                        formData.milestones.length > 0;
      
      if (hasContent) {
        saveDraft(formData);
      }
    }, 2000); // 2秒后自动保存

    return () => clearTimeout(timeoutId);
  }, [formData, isClient, saveDraft]);

  // 页面离开时保存草稿
  useEffect(() => {
    const handleBeforeUnload = () => {
      const hasContent = formData.title || 
                        formData.background || 
                        formData.goals || 
                        formData.team || 
                        formData.budget || 
                        formData.milestones.length > 0;
      
      if (hasContent) {
        saveDraft(formData);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, saveDraft]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 里程碑管理函数
  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      index: formData.milestones.length,
      title: "",
      description: "",
      date: "",
    };
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone],
    }));
    // 自动切换到新添加的里程碑
    setActiveMilestoneIndex(formData.milestones.length);
  };

  const removeMilestone = (id: string) => {
    const indexToRemove = formData.milestones.findIndex((m) => m.id === id);
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones
        .filter((milestone) => milestone.id !== id)
        .map((m, idx) => ({ ...m, index: idx })), // 重新分配index
    }));

    // 调整活动里程碑索引
    if (indexToRemove <= activeMilestoneIndex && activeMilestoneIndex > 0) {
      setActiveMilestoneIndex(activeMilestoneIndex - 1);
    } else if (indexToRemove < activeMilestoneIndex) {
      // 不需要调整
    } else if (formData.milestones.length === 1) {
      // 如果删除的是最后一个里程碑
      setActiveMilestoneIndex(0);
    }
  };

  const updateMilestone = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      ),
    }));
  };

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
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
    "color",
    "background",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      releaseDate: date ? date.toISOString().split('T')[0] : '',
    }));
  };

  const handleMilestoneDateChange = (milestoneId: string, date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone) =>
        milestone.id === milestoneId 
          ? { ...milestone, date: date ? date.toISOString().split('T')[0] : '' }
          : milestone
      ),
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 检查用户是否登录
    if (!userInfo?.did) {
      setError("请先登录");
      return;
    }
    
    setSubmitting(true);
    setError("");

    try {
      console.log("提交提案:", formData);
      
      // 调用 writesPDSOperation 发布提案到 PDS
      const result = await writesPDSOperation({
        record: {
          $type: 'app.dao.proposal',
          data:{
          proposalType: formData.proposalType,
          title: formData.title,
          releaseDate: formData.releaseDate,
          background: formData.background,
          goals: formData.goals,
          team: formData.team,
          budget: formData.budget,
          milestones: formData.milestones,
        }
        },
        did: userInfo.did
      });
      
      console.log('提案发布成功:', result);
      console.log('CID:', result.cid);
      console.log('URI:', result.uri);
      
      // 重置表单
      // setFormData({
      //   proposalType: "",
      //   title: "",
      //   releaseDate: "",
      //   background: "",
      //   goals: "",
      //   team: "",
      //   budget: "",
      //   milestones: [],
      // });

      // 删除草稿
      // clearDraft();

      alert("提案提交成功！");
      
      // 跳转到详情页面，传递 cid 参数
      router.push(`/${locale}/proposal/${encodeURIComponent(result.uri)}`);
      
    } catch (err) {
      setError("提交失败，请重试");
      console.error('提交提案失败:', err);
    } finally {
      setSubmitting(false);
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // 提案设置
        return (
          <ProposalSettings
            formData={formData}
            onInputChange={handleInputChange}
            onDateChange={handleDateChange}
          />
        );

      case 2: // 项目背景
        return (
          <ProjectBackground
            formData={formData}
            onInputChange={(value) =>
              setFormData((prev) => ({ ...prev, background: value }))
            }
            isClient={isClient}
            quillModules={quillModules}
            quillFormats={quillFormats}
          />
        );

      case 3: // 项目目标
        return (
          <ProjectGoals
            formData={formData}
            onInputChange={(value) =>
              setFormData((prev) => ({ ...prev, goals: value }))
            }
            isClient={isClient}
            quillModules={quillModules}
            quillFormats={quillFormats}
          />
        );

      case 4: // 团队介绍
        return (
          <TeamIntroduction
            formData={formData}
            onInputChange={(value) =>
              setFormData((prev) => ({ ...prev, team: value }))
            }
            isClient={isClient}
            quillModules={quillModules}
            quillFormats={quillFormats}
          />
        );

      case 5: // 项目预算
        return (
          <ProjectBudget
            formData={formData}
            onInputChange={handleInputChange}
          />
        );

      case 6: // 里程碑
        return (
          <ProjectMilestones
            formData={formData}
            activeMilestoneIndex={activeMilestoneIndex}
            setActiveMilestoneIndex={setActiveMilestoneIndex}
            addMilestone={addMilestone}
            removeMilestone={removeMilestone}
            updateMilestone={updateMilestone}
            onMilestoneDateChange={handleMilestoneDateChange}
            isClient={isClient}
            quillModules={quillModules}
            quillFormats={quillFormats}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">
      <main>
        <div className="main-content">
          {/* 步骤导航 */}
          <div className="steps-nav">
            <nav aria-label="Progress">
              <div className="steps-container">
                {steps.map((step) => (
                  <div
                    key={step.name}
                    className={
                      "step-item " +
                      `step-button ${currentStep === step.id ? "active" : ""}`
                    }
                    onClick={() => setCurrentStep(step.id)}
                  >
                      {step.name}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        <div className="step-container">
          {/* 当前步骤标题 */}
          <div className="step-title-container">
            <h2 className="step-title">
                {steps[currentStep - 1]?.name}{" "}
                <IoMdInformationCircleOutline
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="当前步骤的解释"
                />
            </h2>
          </div>

          {/* 表单内容 */}
          <form onSubmit={handleSubmit} className="form-container">
            {renderStepContent()}

              {error && <div className="error-message">{error}</div>}

            {/* 导航按钮 */}
            <div className="button-container">
              {currentStep === steps.length ? (
                <div className="button-group">
                  <button
                    type="button"
                       onClick={() => setShowPreview(true)}
                       className="btn btn-outline"
                     >
                       预览提案
                     </button>
                     <button
                       type="button"
                       onClick={() =>
                         setFormData({
                      proposalType: "",
                      title: "",
                      releaseDate: "",
                      background: "",
                      goals: "",
                      team: "",
                      budget: "",
                           milestones: [],
                         })
                       }
                    className="btn btn-secondary"
                  >
                    重置
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    {submitting ? "提交中..." : "提交提案"}
                  </button>
                </div>
              ) : (
                   <div className="button-group">
                     <button
                       type="button"
                       onClick={() => setShowPreview(true)}
                       className="btn btn-outline"
                     >
                       预览提案
                     </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  下一步
                </button>
                   </div>
              )}
            </div>
          </form>
          </div>
        </div>
      </main>
      
      {/* 预览弹窗 */}
      <PreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={formData}
      />
    </div>
  );
}
