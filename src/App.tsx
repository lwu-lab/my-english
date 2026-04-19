/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  MessageSquare, 
  BookOpen, 
  PenTool, 
  Music, 
  ExternalLink,
  Zap,
  Clock,
  ExternalLink as LinkIcon,
  AlertCircle,
  Send,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DayPlan, Task, TaskCategory } from './types';

const DAY_1_PLAN: DayPlan = {
  dayNumber: 1,
  judgment: {
    yesterdayReview: "这是您的学习第一天。我们将从最基础的‘开耳朵’和‘张口说’开始。",
    todayFocus: "建立最基础的礼貌用语 (Greetings)，重点发音 /æ/。",
    dayType: 'Advance',
    reasoning: "作为起点，我们需要在建立自信的同时，确保发音肌肉开始得到正确训练。"
  },
  goals: [
    { title: "听懂基础问候", description: "能够识别 Hello, Hi, Good morning 等常用语。" },
    { title: "建立基础发音", description: "掌握字母 A 的短音 /æ/。" },
    { title: "完成自我介绍", description: "能够流利地说出 My name is [Name]。" }
  ],
  tasks: [
    {
      id: 'task-1',
      category: 'Listening',
      title: '日常问候听力练习',
      duration: 15,
      description: '倾听不同情境下的初次见面问候语。',
      whatToDo: '认真听对话，注意说话者的语气和节奏。',
      whatToListen: 'Hello, Hi, Nice to meet you, Good morning.',
      resources: [
        { type: 'youtube', title: 'Basic Greetings for Beginners', url: 'https://www.youtube.com/watch?v=Fw0rdSHzWFY' }
      ],
      isCompleted: false
    },
    {
      id: 'task-2',
      category: 'Pronunciation',
      title: 'Phonics: 短元音 A',
      duration: 10,
      description: '训练口腔肌肉，准确发出 /æ/ 音。',
      whatToDo: '对着镜子，嘴角向两边拉开，舌头抵住下齿。',
      whatToSay: 'Apple, Cat, Hat, Map, Sad.',
      resources: [
        { type: 'youtube', title: 'How to pronounce /æ/', url: 'https://www.youtube.com/watch?v=SUn0H1S_CIs' }
      ],
      isCompleted: false
    },
    {
      id: 'task-3',
      category: 'Speaking',
      title: '自我介绍练习',
      duration: 15,
      description: '学会介绍自己的名字。',
      whatToDo: '重复练习直到不需要思考就能脱口而出。',
      whatToSay: 'Hi, I am [Name]. Nice to meet you.',
      resources: [
        { type: 'link', title: 'Self Introduction Samples', url: '#' }
      ],
      isCompleted: false
    },
    {
      id: 'task-4',
      category: 'Reading',
      title: '常见标识识别',
      duration: 10,
      description: '识别生活中的基本标志。',
      whatToDo: '读出这些单词并理解其在实际场景中的含义。',
      whatToListen: 'EXIT, OPEN, CLOSED, ENTRY.',
      resources: [
        { type: 'pdf', title: 'Daily Signs PDF', url: '#' }
      ],
      isCompleted: false
    },
    {
      id: 'task-5',
      category: 'Writing',
      title: '书写个人信息',
      duration: 10,
      description: '正确书写自己的姓名和基础问候。',
      whatToDo: '在纸上或打卡框中书写。',
      whatToWrite: 'My name is... Hello!',
      minimumVersion: '仅书写：Nice to meet you.',
      resources: [],
      isCompleted: false
    }
  ],
  vocabulary: [
    { word: 'Hello', translation: '你好', explanation: '最通用正式的问候语', example: 'Hello, everyone.', isMustSpeak: true },
    { word: 'Apple', translation: '苹果', explanation: '用于练习短元音 A 的典型词', example: 'I eat an apple.', isMustSpeak: true },
    { word: 'Map', translation: '地图', explanation: '短元音 A 练习', example: 'I need a map.', isMustSpeak: false }
  ],
  errorsToWatch: [
    "漏掉 am (例如说成 I Name)",
    "/æ/ 音发得太扁（像 /e/）",
    "结尾辅音丢掉 (例如 Map 读成 Ma)"
  ],
  checkInFormat: "写下你今天学会的 3 个句子：\n1. Hello, I am...\n2. Nice to meet you.\n3. ..."
};

const CATEGORY_ICONS: Record<TaskCategory, any> = {
  Listening: Music,
  Speaking: MessageSquare,
  Reading: BookOpen,
  Writing: PenTool,
  Pronunciation: Zap
};

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Listening: 'bg-indigo-100 text-indigo-700',
  Speaking: 'bg-emerald-100 text-emerald-700',
  Reading: 'bg-amber-100 text-amber-700',
  Writing: 'bg-pink-100 text-pink-700',
  Pronunciation: 'bg-slate-100 text-slate-700'
};

export default function App() {
  const [plan, setPlan] = useState<DayPlan>(DAY_1_PLAN);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [checkInText, setCheckInText] = useState('');
  const [isMiniVersion, setIsMiniVersion] = useState(false);

  const completedCount = useMemo(() => 
    plan.tasks.filter(t => t.isCompleted).length, 
  [plan.tasks]);

  const toggleTask = (id: string) => {
    setPlan(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
    }));
  };

  const currentTasks = useMemo(() => {
    if (isMiniVersion) {
      return plan.tasks.slice(0, 3);
    }
    return plan.tasks;
  }, [plan.tasks, isMiniVersion]);

  return (
    <div className="min-h-screen bg-bg text-ink font-sans flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="h-20 bg-card border-b border-border flex items-center justify-between px-10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <h1 className="text-xl font-bold tracking-tight">English Coach 2.0</h1>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-xs uppercase tracking-wider text-muted font-semibold">第 1 季度：重建基础</span>
          <div className="bg-blue-100 text-primary px-4 py-1.5 rounded-full font-bold text-sm">
            Day {plan.dayNumber}
          </div>
          <button 
            onClick={() => setIsMiniVersion(!isMiniVersion)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              isMiniVersion 
              ? 'bg-primary text-white border-primary' 
              : 'border-border text-muted hover:bg-slate-50'
            }`}
          >
            20min 精简
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-[320px_1fr] gap-6 p-8 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Coach Card */}
          <section className="bg-card border border-border rounded-[24px] p-6 shadow-sm">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl mb-4">
              👨‍🏫
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold">早安，李先生。</p>
              <p className="text-sm leading-relaxed text-ink/80">
                今天是“{plan.judgment.dayType === 'Advance' ? '推进日' : '巩固日'}”。{plan.judgment.yesterdayReview}
              </p>
              <div className="h-px bg-border my-2" />
              <p className="text-[12px] text-muted leading-tight">
                <span className="inline-block mr-1">💡</span> 今日重点：{plan.judgment.todayFocus}
              </p>
            </div>
          </section>

          {/* Goals Shortlist */}
          <div className="grid grid-cols-1 gap-3">
            {plan.goals.map((goal, i) => (
              <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-3 flex gap-3 items-start">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-bold text-primary uppercase">{goal.title}</h4>
                  <p className="text-[10px] text-muted leading-tight">{goal.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Check-in Section */}
          <section className="bg-card border border-border rounded-[24px] p-6 shadow-sm mt-auto">
            <h2 className="text-base font-bold mb-2">每日打卡</h2>
            <p className="text-xs text-muted mb-4">写下你今天学会的 3 个句子：</p>
            <textarea 
              value={checkInText}
              onChange={(e) => setCheckInText(e.target.value)}
              placeholder="1. Hello, I am...&#10;2. ..."
              className="w-full h-24 border border-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none mb-3 bg-slate-50/50"
            />
            <button 
              onClick={() => alert('打卡成功！已记录。')}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" /> 提交打卡
            </button>
          </section>

          {/* Progress dots */}
          <div className="flex gap-2 pt-2">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-1.5 rounded-full ${i < plan.dayNumber ? 'bg-primary' : 'bg-border'}`}
              />
            ))}
          </div>
        </aside>

        {/* Task List (Main) */}
        <section className="flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          {currentTasks.map((task) => {
            const Icon = CATEGORY_ICONS[task.category];
            const isExpanded = expandedTaskId === task.id;
            const colorClass = CATEGORY_COLORS[task.category];

            return (
              <div 
                key={task.id} 
                className={`bg-card border border-border rounded-[20px] transition-all duration-300 ${
                  isExpanded ? 'ring-1 ring-primary shadow-sm' : ''
                }`}
              >
                <div 
                  className="p-5 grid grid-cols-[48px_1fr_120px] items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink">{task.category}：{task.title}</h3>
                    <p className="text-xs text-muted">{task.duration}分钟 • {task.description}</p>
                  </div>
                  <div className="flex justify-end pr-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        task.isCompleted ? 'bg-emerald-50 text-accent' : 'border border-border text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border"
                    >
                      <div className="p-6 bg-slate-50/50 space-y-6">
                        <div className="grid grid-cols-2 gap-8 text-sm">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5">怎么学</h4>
                              <p className="leading-relaxed text-ink/90">{task.whatToDo}</p>
                            </div>
                            {task.resources.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">资源包</h4>
                                <div className="flex flex-wrap gap-2">
                                  {task.resources.map((res, idx) => (
                                    <a 
                                      key={idx} 
                                      href={res.url} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="bg-white border border-border rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-2 hover:bg-slate-50 transition-all text-primary"
                                    >
                                      {res.type === 'youtube' && <PlayCircle className="w-3.5 h-3.5" />}
                                      {res.type === 'pdf' && <BookOpen className="w-3.5 h-3.5" />}
                                      {res.type === 'link' && <LinkIcon className="w-3.5 h-3.5" />}
                                      {res.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="space-y-4">
                            {task.whatToSay && (
                              <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">核心口语</h4>
                                <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-dashed border-border leading-loose">
                                  {task.whatToSay}
                                </p>
                              </div>
                            )}
                            {task.whatToListen && (
                              <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">重点识别</h4>
                                <p className="text-xs italic text-ink/80">"{task.whatToListen}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Additional Info Grid */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <section className="bg-card border border-border rounded-[24px] p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> 本日词汇
              </h2>
              <div className="space-y-4">
                {plan.vocabulary.map((v, i) => (
                  <div key={i} className="flex justify-between items-start border-b border-slate-50 pb-2 last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{v.word}</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-muted uppercase font-bold">{v.translation}</span>
                        {v.isMustSpeak && <div className="w-1.5 h-1.5 bg-red-400 rounded-full" title="Must speak" />}
                      </div>
                      <p className="text-[10px] text-muted italic mt-0.5">{v.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-900 rounded-[24px] p-6 text-white">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" /> 纠错提醒
              </h2>
              <ul className="space-y-3">
                {plan.errorsToWatch.map((err, i) => (
                  <li key={i} className="flex items-start gap-3 text-[11px] leading-relaxed text-slate-300">
                    <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    {err}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="h-10 px-10 border-t border-border bg-white flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-muted">
        <span>Road to Fluency • 2026-2028</span>
        <span>Finish &gt; Perfect • Hard Work Pays Off</span>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}


