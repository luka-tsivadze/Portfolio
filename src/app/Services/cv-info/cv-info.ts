import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CvInfo {
  


   Sprojects = [
      {
        Title: 'FindHouse',
Description:
  'Full real-estate platform featuring interactive maps, property filtering, video and image uploads, custom services, lazy-loaded modules, and robust error handling. Built with a clean, scalable component structure and a modern UI focused on real product functionality.',
       Technologies: [
          'Angular',
          'TypeScript',
          'SCSS',
          'REST API',
          'RxJS',
          'responsive design',
          'Seo',
        ],
        imgs: ['images/FindHouse/f0.png', 'images/FindHouse/f1.png', 'images/FindHouse/f2.png', 'images/FindHouse/f3.png'],

        demoLink: 'https://findhouse.ge/',
      },
    {
  Title: 'GTU Chatbot',
  Description:
    'AI-powered chatbot built for Georgian Technical University. Handles student registration, provides automated assistance, and supports university-only authentication. Full UI implemented with clean Angular components. AI features are prepared but currently disabled.',
  Technologies: ['Angular', 'TypeScript', 'SCSS', 'REST API' , 'responsive design'],
  imgs: [
    'images/GTUChatBot/0g.png',
    'images/GTUChatBot/2g.png',
    'images/GTUChatBot/1g.png',
    'images/GTUChatBot/3g.png',
  ],

  demoLink: 'https://gtu-chatbot.netlify.app/'
},

      {
        Title: 'TravelerMountain',
        Description:
       'Travel-themed showcase website focused on custom UI design and a modern visual experience. Built as a design-driven project highlighting layout work, animations, and aesthetic presentation rather than performance or framework structure.',   
            Technologies: ['html', 'css', 'JavaScript', 'Firebase', 'bootstrap'],
        imgs: [
         'images/TrevelerMountain/m0.png',
          'images/TrevelerMountain/m1.png',
          'images/TrevelerMountain/m2.png',
          'images/TrevelerMountain/m3.png',
          'images/TrevelerMountain/m4.png',
        ],
     
        demoLink: 'https://travelermountain.netlify.app/',
      },
        {
        Title: 'CodeDiff',
Description:
  'Built during an 8-hour hackathon as a presentation tool for our game project. The site showcases the full game structure and includes an AI chatbot page designed for final interaction layers. The AI module runs only when launched separately, but the project still delivered complete functionality for judging — and won the hackathon.',
  Technologies: ['Angular', 'TypeScript', 'SCSS' ,'responsive design'],
        imgs: [
          'images/CodeDiff/c0.png',
          'images/CodeDiff/c1.png',
        ],
      
        demoLink: 'https://codediff.netlify.app/',
      },
   {
  Title: '2rism World',
  Description:
    'My first full Angular application featuring Firebase authentication, multi-page routing, and smooth component-based animations. Built as an early learning project focused on understanding Angular structure, services, and user flows, with a simpler UI compared to my newer work.',
  Technologies: ['Angular', 'TypeScript', 'Firebase Auth', 'SCSS', 'responsive design'],
  imgs: [
    'images/FirstProject/T0.png',
    'images/FirstProject/T1.png',
    'images/FirstProject/T2.png',
  ],
  ghLink: '',       // add later if available
  demoLink: 'https://2rism-world.netlify.app/'
}];
heroinformation={
  name:"Luka Tsivadze ",
  role:"Angular Developer / It Specialist", 
  location:"Tbilisi, Georgia" ,
  about:"IT professional and Front-End Developer with experience across both software development and hands-on hardware systems. Proficient in building responsive web applications using Angular and React, and experienced in diagnosing, installing, and configuring a wide range of IT hardware including POS systems, industrial scanners, EAS security systems, and network peripherals. Comfortable working in technical, client-facing, and team coordination roles. Currently seeking opportunities to grow within the IT field and take on broader infrastructure and systems responsibilities.",
  available:"Available for any kind of work opportunity" ,
  miniskills:'IT Specialist · Angular · TypeScript',
  btncv:'Download CV', 
  btnprojeects:'View Projects'
}

}
