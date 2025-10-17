import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-comp2',
  imports: [CommonModule],
  templateUrl: './comp2.html',
  styleUrl: './comp2.scss',
})
export class Comp2 {
  constructor(public sanitizer: DomSanitizer) {}

  recentTests = [
    {
      title: 'SSC CGL Tier 1 Mock',
      category: 'SSC Exams',
      progress: 50,
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />',
      iconBgColor: 'bg-purple-500/10',
      iconTextColor: 'text-purple-400',
    },
    {
      title: 'IBPS PO Prelims',
      category: 'Banking Exams',
      progress: 10,
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />',
      iconBgColor: 'bg-pink-500/10',
      iconTextColor: 'text-pink-400',
    },
  ];

  suggestedTests = [
    {
      title: 'UPSC CSE Prelims GS',
      category: 'Civil Services',
      questions: 100,
      duration: 120,
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.148 1.867 1.06 1.867 2.108v3.375c0 1.148-.935 2.077-2.083 2.077H7.833c-1.148 0-2.083-.93-2.083-2.077v-3.375c0-1.048.83-1.96 1.867-2.108 1.105-.157 2.235-.237 3.383-.237zM6 9.75a6 6 0 1112 0v3.375c0 .621-.504 1.125-1.125 1.125H7.125A1.125 1.125 0 016 13.125V9.75z" />',
      iconBgColor: 'bg-blue-500/10',
      iconTextColor: 'text-blue-400',
    },
    {
      title: 'Railway NTPC CBT-1',
      category: 'Railway Exams',
      questions: 100,
      duration: 90,
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-1.085 17.903 17.903 0 00-9.193-3.213c-.621-.039-1.124.469-1.124 1.09v1.5m17.25 4.5h-15M6.375 18.75a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />',
      iconBgColor: 'bg-red-500/10',
      iconTextColor: 'text-red-400',
    },
    {
      title: 'CAT 2025 Mock',
      category: 'MBA Entrance',
      questions: 66,
      duration: 120,
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.873 1.937 3.873-1.937m15.482 0l3.873 1.937-3.873-1.937M6.115 5.462l-3.873 1.937M17.885 5.462l3.873 1.937" />',
      iconBgColor: 'bg-green-500/10',
      iconTextColor: 'text-green-400',
    },
    {
      title: 'SSC CGL Tier 1 Mock',
      category: 'SSC Exams',
      questions: 100,
      duration: 60,
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />',
      iconBgColor: 'bg-purple-500/10',
      iconTextColor: 'text-purple-400',
    },
  ];

  liveTests = [
    {
      title: 'All India Reasoning Championship',
      category: 'All Exams',
      description: 'Go head-to-head with the best minds in this live reasoning battle.',
      participants: '15,000+',
      duration: 20,
    },
    {
      title: 'Weekly Banking GA',
      category: 'Banking Exams',
      description: 'Stay updated with the latest in banking awareness and current affairs.',
      participants: '8,000+',
      duration: 15,
    },
  ];
}
