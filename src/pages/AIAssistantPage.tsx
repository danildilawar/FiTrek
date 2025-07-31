import React from 'react';
import { Bot, MessageCircle, Sparkles, Brain, Zap, Target } from 'lucide-react';

export function AIAssistantPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold font-poppins bg-gradient-to-r from-primary to-accent-dark bg-clip-text text-transparent">
            Coach FiTrek
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all hover:bg-primary/10 dark:hover:bg-primary/20 animate-slide-up">
            <MessageCircle className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3">Personal Coach</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Get real-time guidance and answers to all your fitness questions. Your AI coach is available 24/7.
            </p>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all hover:bg-primary/10 dark:hover:bg-primary/20 animate-slide-up">
            <Sparkles className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3">Custom Plans</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Receive personalized workout recommendations based on your goals, fitness level, and preferences.
            </p>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all hover:bg-primary/10 dark:hover:bg-primary/20 sm:col-span-2 lg:col-span-1 animate-slide-up">
            <Brain className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3">Expert Knowledge</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Access comprehensive information about exercises, nutrition, and proper form techniques.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-primary/5 to-accent-light dark:from-primary/10 dark:to-primary/5 rounded-xl p-4 sm:p-6 border border-primary/10 animate-slide-up">
            <Zap className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-2">Instant Answers</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                • Exercise form guidance
              </li>
              <li className="flex items-center gap-2">
                • Nutrition advice
              </li>
              <li className="flex items-center gap-2">
                • Workout modifications
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent-light dark:from-primary/10 dark:to-primary/5 rounded-xl p-4 sm:p-6 border border-primary/10 animate-slide-up">
            <Target className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-2">Goal Setting</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                • Progress tracking
              </li>
              <li className="flex items-center gap-2">
                • Personalized milestones
              </li>
              <li className="flex items-center gap-2">
                • Achievement rewards
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-slide-up">
          <div className="bg-primary/5 dark:bg-primary/10 border-b border-primary/10 p-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Chat with Coach FiTrek</p>
            </div>
          </div>
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/GmvE2QUv17veIwCqB3Rj0"
            width="100%"
            style={{ height: '500px', minHeight: '500px' }}
            frameBorder="0"
            className="w-full bg-white dark:bg-gray-900 sm:h-[700px] sm:min-h-[700px]"
          ></iframe>
        </div>
      </div>
    </div>
  );
}