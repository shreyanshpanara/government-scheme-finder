import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  User,
  RotateCcw,
  Info,
  HelpCircle,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const QUICK_PROMPTS = [
  'What documents are required for PM-KISAN?',
  'How to apply for Ayushman Bharat PM-JAY health card?',
  'Which scholarships are available for OBC & SC college students?',
  'How can I get up to ₹10 Lakh collateral-free loan under MUDRA?',
  'What is the Sukanya Samriddhi Yojana interest rate and eligibility?',
  'Is there any scheme for persons with disability (Divyangjan)?'
];

export default function AIAssistant() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const schemeIdFromUrl = searchParams.get('schemeId');

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Namaste! I am **SetuSaathi**, your Indian Government Citizen Welfare Assistant.\n\nHow can I help you today? You can ask me about:\n• Documents required for any scheme\n• Eligibility criteria and income limits\n• Step-by-step application procedures\n• Finding subsidies for farmers, students, women, or artisans.`,
      disclaimer: '⚠️ Disclaimer: This guidance is provided for citizen awareness based on official guidelines. Please verify final eligibility on the respective official portal.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // If schemeId is passed in URL query, trigger automated greeting for that scheme
  useEffect(() => {
    if (schemeIdFromUrl) {
      handleSend(`What are the benefits, documents, and application steps for this scheme?`, schemeIdFromUrl);
    }
  }, [schemeIdFromUrl]);

  const handleSend = async (queryText = null, targetSchemeId = null) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        query: textToSend,
        currentSchemeId: targetSchemeId || schemeIdFromUrl || null,
        context: {
          userName: user?.name,
          userOccupation: user?.occupation,
          userState: user?.state,
        },
      });

      const aiReply = res.data.data;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: aiReply.answer,
          source: aiReply.source,
          suggestedSchemes: aiReply.suggestedSchemes,
          disclaimer: aiReply.disclaimer,
        },
      ]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an issue retrieving the scheme details right now. Please try asking again or browse the Schemes catalog.',
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Namaste! I am **SetuSaathi**, your Indian Government Citizen Welfare Assistant. How can I help you today?`,
        disclaimer: '⚠️ Disclaimer: This guidance is provided for citizen awareness based on official guidelines. Please verify final eligibility on the respective official portal.',
      },
    ]);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gov-navy to-gov-blue text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-gov-saffron" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gov-navy flex items-center gap-2">
                SetuSaathi AI <span className="text-[10px] font-bold uppercase bg-orange-100 text-gov-saffron px-2 py-0.5 rounded border border-orange-200">Citizen Assistant</span>
              </h1>
              <p className="text-xs text-slate-500">
                Official Scheme Explanations, Criteria Guidance & Document Checklists
              </p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition text-xs font-semibold flex items-center gap-1.5"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Chat History Box */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-card p-4 sm:p-6 overflow-y-auto max-h-[600px] space-y-6 flex flex-col">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse self-end' : 'self-start'} max-w-[88%]`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 shadow-sm ${
                    isUser
                      ? 'bg-gov-blue text-white'
                      : 'bg-orange-100 text-gov-saffron border border-orange-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gov-blue text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  {/* Content (supports newlines and basic markdown style) */}
                  <div className="whitespace-pre-line space-y-2">
                    {msg.content}
                  </div>

                  {/* Suggested schemes pills if returned */}
                  {msg.suggestedSchemes && msg.suggestedSchemes.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block w-full">
                        Referenced Schemes:
                      </span>
                      {msg.suggestedSchemes.map((s) => (
                        <Link
                          key={s.id}
                          to={`/schemes/${s.id}`}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-gov-sky hover:text-gov-navy font-semibold text-xs transition inline-flex items-center gap-1 shadow-2xs"
                        >
                          {s.code || s.name} <ExternalLink className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Legal Disclaimer */}
                  {msg.disclaimer && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[10px] text-slate-600 italic">
                      {msg.disclaimer}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-3 self-start">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-gov-saffron flex items-center justify-center text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gov-sky animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-gov-sky animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-gov-sky animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-medium">Analyzing government guidelines...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Suggested:
          </span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-gov-lightBlue hover:text-gov-blue hover:border-gov-blue text-xs whitespace-nowrap transition shadow-2xs font-medium flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-2 relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about required documents, eligibility, income ceilings, or how to apply..."
            className="w-full pl-5 pr-14 py-4 rounded-2xl border border-slate-300 bg-white text-sm shadow-card focus:ring-2 focus:ring-gov-sky focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2.5 p-2.5 bg-gov-saffron hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400 mt-2">
          Notice: AI-generated answers are grounded on official government rules. Always verify requirements on official application portals.
        </p>

      </div>
    </div>
  );
}
