import { FormEvent, useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowLeft, Camera, Check, FileText, ImagePlus, Info, Lightbulb, ListChecks, Plus, Route, Save, ShieldAlert, Trash2, X } from 'lucide-react'
import { createRecoverySnapshot, db, normalizeProblemRecord, saveImage } from '../db'
import type { Problem, ProblemDifficulty, ProblemOption, QuestionFormat, SolutionMethod } from '../types'
import { DbImage } from '../components/DbImage'
import { auditProblemBank } from '../data/questionQuality'

interface ProblemFormPageProps {
  editId?: string
  onBack: () => void
  onSaved: (message: string) => void
}

interface FormState {
  title: string
  statement: string
  source: string
  page: string
  tags: string
  coreMethod: string
  mistakes: string
  answerText: string
  questionFormat: QuestionFormat
  options: ProblemOption[]
  correctOptionIds: string[]
  solutionMethods: SolutionMethod[]
  difficulty: ProblemDifficulty
  prerequisites: string
  estimatedMinutes: number
  discrimination: ProblemDifficulty
}

const emptyForm: FormState = {
  title: '',
  statement: '',
  source: '',
  page: '',
  tags: '',
  coreMethod: '',
  mistakes: '',
  answerText: '',
  questionFormat: 'open',
  options: [
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' }
  ],
  correctOptionIds: [],
  solutionMethods: [
    { id: 'method-1', title: '方法一', content: '' },
    { id: 'method-2', title: '方法二', content: '' }
  ],
  difficulty: 2,
  prerequisites: '',
  estimatedMinutes: 6,
  discrimination: 2
}

export function ProblemFormPage({ editId, onBack, onSaved }: ProblemFormPageProps) {
  const existing = useLiveQuery(() => editId ? db.problems.get(editId) : undefined, [editId])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [questionFile, setQuestionFile] = useState<File>()
  const [answerFile, setAnswerFile] = useState<File>()
  const [removeQuestionImage, setRemoveQuestionImage] = useState(false)
  const [removeAnswerImage, setRemoveAnswerImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!existing) {
      if (!editId) setForm(emptyForm)
      return
    }
    setForm({
      title: existing.title,
      statement: existing.statement,
      source: existing.source,
      page: existing.page,
      tags: existing.tags.join('，'),
      coreMethod: existing.coreMethod,
      mistakes: existing.mistakes,
      answerText: existing.answerText,
      questionFormat: existing.questionFormat || 'open',
      options: existing.options?.length ? existing.options : emptyForm.options,
      correctOptionIds: existing.correctOptionIds || [],
      solutionMethods: existing.solutionMethods?.length ? existing.solutionMethods : emptyForm.solutionMethods,
      difficulty: existing.difficulty || 2,
      prerequisites: (existing.prerequisites || []).join('，'),
      estimatedMinutes: existing.estimatedMinutes || 6,
      discrimination: existing.discrimination || 2
    })
  }, [existing, editId])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function setQuestionFormat(questionFormat: QuestionFormat) {
    setForm((current) => ({
      ...current,
      questionFormat,
      correctOptionIds: questionFormat === 'single-choice'
        ? current.correctOptionIds.slice(0, 1)
        : questionFormat === 'open' ? [] : current.correctOptionIds
    }))
  }

  function updateOption(id: string, text: string) {
    setForm((current) => ({
      ...current,
      options: current.options.map((option) => option.id === id ? { ...option, text } : option)
    }))
  }

  function toggleCorrectOption(id: string) {
    setForm((current) => ({
      ...current,
      correctOptionIds: current.questionFormat === 'single-choice'
        ? [id]
        : current.correctOptionIds.includes(id)
          ? current.correctOptionIds.filter((optionId) => optionId !== id)
          : [...current.correctOptionIds, id]
    }))
  }

  function addOption() {
    setForm((current) => {
      if (current.options.length >= 6) return current
      const nextId = ['A', 'B', 'C', 'D', 'E', 'F'].find((id) => !current.options.some((option) => option.id === id)) || crypto.randomUUID()
      return { ...current, options: [...current.options, { id: nextId, text: '' }] }
    })
  }

  function removeOption(id: string) {
    setForm((current) => {
      if (current.options.length <= 2) return current
      return {
        ...current,
        options: current.options.filter((option) => option.id !== id),
        correctOptionIds: current.correctOptionIds.filter((optionId) => optionId !== id)
      }
    })
  }

  function updateMethod(id: string, key: 'title' | 'content', value: string) {
    setForm((current) => ({
      ...current,
      solutionMethods: current.solutionMethods.map((method) => method.id === id ? { ...method, [key]: value } : method)
    }))
  }

  function addMethod() {
    setForm((current) => ({
      ...current,
      solutionMethods: [...current.solutionMethods, { id: crypto.randomUUID(), title: `方法${current.solutionMethods.length + 1}`, content: '' }]
    }))
  }

  function removeMethod(id: string) {
    setForm((current) => ({ ...current, solutionMethods: current.solutionMethods.filter((method) => method.id !== id) }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!form.title.trim()) return setError('请给这张卡起一个便于搜索的标题。')
    if (!form.statement.trim() && !questionFile && !(existing?.questionImageId && !removeQuestionImage)) {
      return setError('题面文字和题目图片至少填写一项。')
    }
    if (!form.answerText.trim() && !answerFile && !(existing?.answerImageId && !removeAnswerImage)) {
      return setError('答案文字和答案图片至少填写一项。')
    }
    const filledOptions = form.options.filter((option) => option.text.trim())
    if (form.questionFormat !== 'open' && filledOptions.length < 2) {
      return setError('选择题至少需要两个有效选项。')
    }
    if (form.questionFormat !== 'open' && !form.correctOptionIds.some((id) => filledOptions.some((option) => option.id === id))) {
      return setError('请标记至少一个正确选项。')
    }

    setSaving(true)
    try {
      let questionImageId = removeQuestionImage ? undefined : existing?.questionImageId
      let answerImageId = removeAnswerImage ? undefined : existing?.answerImageId
      const oldImagesToDelete: string[] = []

      if (questionFile) {
        questionImageId = await saveImage(questionFile)
        if (existing?.questionImageId) oldImagesToDelete.push(existing.questionImageId)
      } else if (removeQuestionImage && existing?.questionImageId) {
        oldImagesToDelete.push(existing.questionImageId)
      }
      if (answerFile) {
        answerImageId = await saveImage(answerFile)
        if (existing?.answerImageId) oldImagesToDelete.push(existing.answerImageId)
      } else if (removeAnswerImage && existing?.answerImageId) {
        oldImagesToDelete.push(existing.answerImageId)
      }

      const now = Date.now()
      const record: Problem = normalizeProblemRecord({
        id: existing?.id || crypto.randomUUID(),
        kind: 'problem',
        title: form.title.trim(),
        statement: form.statement.trim(),
        source: form.source.trim(),
        page: form.page.trim(),
        tags: form.tags.split(/[，,、]/).map((tag) => tag.trim()).filter(Boolean),
        coreMethod: form.coreMethod.trim(),
        mistakes: form.mistakes.trim(),
        answerText: form.answerText.trim(),
        questionFormat: form.questionFormat,
        options: form.questionFormat === 'open' ? [] : filledOptions.map((option) => ({ ...option, text: option.text.trim() })),
        correctOptionIds: form.questionFormat === 'open'
          ? []
          : form.correctOptionIds.filter((id) => filledOptions.some((option) => option.id === id)),
        solutionMethods: form.solutionMethods
          .filter((method) => method.content.trim())
          .map((method) => ({ ...method, title: method.title.trim() || '补充方法', content: method.content.trim() })),
        difficulty: form.difficulty,
        prerequisites: form.prerequisites.split(/[，,、]/).map((item) => item.trim()).filter(Boolean),
        estimatedMinutes: form.estimatedMinutes,
        discrimination: form.discrimination,
        questionImageId,
        answerImageId,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        nextReviewAt: existing?.nextReviewAt || now,
        intervalIndex: existing?.intervalIndex ?? -1,
        reviewCount: existing?.reviewCount || 0,
        archived: existing?.archived,
        isSeed: existing?.isSeed,
        seedVersion: existing?.seedVersion
      })

      let savedRecord: Problem = record
      await db.transaction('rw', db.problems, db.images, async () => {
        const existingBank = await db.problems.toArray()
        const auditedBank = auditProblemBank([...existingBank.filter((problem) => problem.id !== record.id), record])
        savedRecord = auditedBank.find((problem) => problem.id === record.id) || record
        await db.problems.bulkPut(auditedBank)
        if (oldImagesToDelete.length) await db.images.bulkDelete(Array.from(new Set(oldImagesToDelete)))
      })
      await createRecoverySnapshot(existing ? '编辑题卡' : '新增题卡')
      onSaved(savedRecord.qualityStatus === 'needs-review'
        ? '题卡已保存到待人工确认区；补齐红色问题后才会进入随机题池'
        : existing ? '题卡修改已保存并通过质量检查' : '新题卡已加入精品题库')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '保存失败，请再试一次。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page form-page">
      <header className="review-header form-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="返回"><ArrowLeft size={22} /></button>
        <div><span>{editId ? '编辑题卡' : '新增题卡'}</span><small>图片只保存在这台设备</small></div>
        <span className="step-label">MVP</span>
      </header>

      <form className="problem-form" onSubmit={submit}>
        <section className="form-section">
          <div className="section-title"><FileText size={19} /><div><h2>题面</h2><p>录入例题、课后题或自己的错题</p></div></div>
          <label className="field"><span>标题 <b>*</b></span><input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="例：等价无穷小的使用边界" /></label>
          <label className="field"><span>题面 / 提问</span><textarea value={form.statement} onChange={(e) => update('statement', e.target.value)} placeholder="可直接粘贴题目，或写成主动回忆问题…" rows={4} /></label>
          <ImageField
            label="题目图片"
            existingId={existing?.questionImageId}
            removed={removeQuestionImage}
            file={questionFile}
            onFile={setQuestionFile}
            onRemove={() => { setQuestionFile(undefined); setRemoveQuestionImage(true) }}
          />
        </section>

        <section className="form-section">
          <div className="section-title"><ListChecks size={19} /><div><h2>作答方式</h2><p>开放题、单选或多选</p></div></div>
          <div className="segmented-control format-control">
            <button type="button" className={form.questionFormat === 'open' ? 'active' : ''} onClick={() => setQuestionFormat('open')}>开放题</button>
            <button type="button" className={form.questionFormat === 'single-choice' ? 'active' : ''} onClick={() => setQuestionFormat('single-choice')}>单选</button>
            <button type="button" className={form.questionFormat === 'multiple-choice' ? 'active' : ''} onClick={() => setQuestionFormat('multiple-choice')}>多选</button>
          </div>
          {form.questionFormat !== 'open' && (
            <div className="option-editor">
              <p className="field-help">点选左侧标记正确答案；做题时选项会保持锁定到揭晓。</p>
              {form.options.map((option) => (
                <div className="option-edit-row" key={option.id}>
                  <button
                    type="button"
                    className={`answer-key ${form.correctOptionIds.includes(option.id) ? 'selected' : ''}`}
                    onClick={() => toggleCorrectOption(option.id)}
                    aria-label={`${option.id} 设为${form.correctOptionIds.includes(option.id) ? '非正确' : '正确'}选项`}
                    aria-pressed={form.correctOptionIds.includes(option.id)}
                  >{option.id}</button>
                  <input value={option.text} onChange={(event) => updateOption(option.id, event.target.value)} placeholder={`选项 ${option.id}`} />
                  <button type="button" className="mini-icon-button" onClick={() => removeOption(option.id)} aria-label={`删除选项 ${option.id}`} disabled={form.options.length <= 2}><X size={17} /></button>
                </div>
              ))}
              {form.options.length < 6 && <button type="button" className="text-button primary-text add-inline" onClick={addOption}><Plus size={16} />增加选项</button>}
            </div>
          )}
        </section>

        <section className="form-section two-column-fields">
          <div className="section-title"><Info size={19} /><div><h2>出处与索引</h2><p>方便回到原书上下文</p></div></div>
          <label className="field"><span>来源</span><input value={form.source} onChange={(e) => update('source', e.target.value)} placeholder="书名 / 试卷 / 自己整理" /></label>
          <label className="field"><span>页码</span><input value={form.page} onChange={(e) => update('page', e.target.value)} inputMode="numeric" placeholder="例如 128" /></label>
          <label className="field full-field"><span>知识点标签</span><input value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="高等数学，极限，泰勒公式" /><small>用逗号分隔，搜索和筛选都会用到</small></label>
          <label className="field full-field"><span>前置知识</span><input value={form.prerequisites} onChange={(e) => update('prerequisites', e.target.value)} placeholder="极限定义，等价无穷小" /><small>自适应系统会用它安排基础巩固顺序</small></label>
          <label className="field"><span>难度</span><select value={form.difficulty} onChange={(event) => update('difficulty', Number(event.target.value) as ProblemDifficulty)}>{[1, 2, 3, 4, 5].map((value) => <option value={value} key={value}>{value} / 5</option>)}</select></label>
          <label className="field"><span>预计用时（分钟）</span><input type="number" min={1} max={60} inputMode="numeric" value={form.estimatedMinutes} onChange={(event) => update('estimatedMinutes', Math.max(1, Math.min(60, Number(event.target.value) || 1)))} /></label>
          <label className="field"><span>区分度</span><select value={form.discrimination} onChange={(event) => update('discrimination', Number(event.target.value) as ProblemDifficulty)}>{[1, 2, 3, 4, 5].map((value) => <option value={value} key={value}>{value} / 5</option>)}</select></label>
        </section>

        <section className="form-section">
          <div className="section-title"><Check size={19} /><div><h2>答案与复盘</h2><p>默认锁定，思考后才显示</p></div></div>
          <label className="field"><span>答案 / 定义正文</span><textarea value={form.answerText} onChange={(e) => update('answerText', e.target.value)} placeholder="写结论和必要的推导，不必抄整页解析…" rows={5} /></label>
          <ImageField
            label="答案图片"
            existingId={existing?.answerImageId}
            removed={removeAnswerImage}
            file={answerFile}
            onFile={setAnswerFile}
            onRemove={() => { setAnswerFile(undefined); setRemoveAnswerImage(true) }}
          />
          <label className="field icon-field"><span><Lightbulb size={16} />核心方法</span><textarea value={form.coreMethod} onChange={(e) => update('coreMethod', e.target.value)} placeholder="一句话写出切入点、通法或关键变形…" rows={3} /></label>
          <label className="field icon-field warning-field"><span><ShieldAlert size={16} />易错点</span><textarea value={form.mistakes} onChange={(e) => update('mistakes', e.target.value)} placeholder="这道题最容易在哪一步出错？" rows={3} /></label>
        </section>

        <section className="form-section">
          <div className="section-title"><Route size={19} /><div><h2>多方法解析</h2><p>分别写完整路线，便于比较迁移</p></div></div>
          <div className="method-editor-list">
            {form.solutionMethods.map((method, index) => (
              <div className="method-editor" key={method.id}>
                <div className="method-editor-head">
                  <strong>路线 {index + 1}</strong>
                  <button type="button" className="mini-icon-button" onClick={() => removeMethod(method.id)} aria-label={`删除路线 ${index + 1}`}><Trash2 size={16} /></button>
                </div>
                <input value={method.title} onChange={(event) => updateMethod(method.id, 'title', event.target.value)} placeholder="例：方法一 · 泰勒展开" />
                <textarea value={method.content} onChange={(event) => updateMethod(method.id, 'content', event.target.value)} placeholder="写出关键推导与适用条件…" rows={4} />
              </div>
            ))}
          </div>
          <button type="button" className="button button-secondary button-full" onClick={addMethod}><Plus size={17} />增加一种解法</button>
        </section>

        {error && <div className="form-error" role="alert">{error}</div>}
        <button type="submit" className="button button-accent button-full save-button" disabled={saving}>
          <Save size={19} /> {saving ? '正在保存图片…' : editId ? '保存修改' : '加入题库'}
        </button>
      </form>
    </main>
  )
}

interface ImageFieldProps {
  label: string
  existingId?: string
  removed: boolean
  file?: File
  onFile: (file?: File) => void
  onRemove: () => void
}

function ImageField({ label, existingId, removed, file, onFile, onRemove }: ImageFieldProps) {
  const preview = useFilePreview(file)
  const hasImage = !!preview || (!!existingId && !removed)
  return (
    <div className="image-field">
      <span className="field-label">{label}</span>
      {hasImage ? (
        <div className="image-preview-wrap">
          {preview ? <img src={preview} alt={`${label}预览`} /> : <DbImage imageId={existingId} alt={label} />}
          <button type="button" className="remove-image" onClick={onRemove}><Trash2 size={16} />移除</button>
        </div>
      ) : (
        <label className="upload-zone">
          <Camera size={24} />
          <span><strong>拍照或从相册选择</strong><small>大图会自动压缩，备份仍保留</small></span>
          <ImagePlus size={19} />
          <input type="file" accept="image/*" capture="environment" onChange={(event) => { onFile(event.target.files?.[0]); event.target.value = '' }} />
        </label>
      )}
    </div>
  )
}

function useFilePreview(file?: File) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (!file) { setUrl(''); return }
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url
}
