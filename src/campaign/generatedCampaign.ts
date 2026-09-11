import type { StagePayload } from './types';
import { CAMPAIGN_STAGES } from './schedule';

export const CAMPAIGN_PAYLOAD: StagePayload = {
  stage: CAMPAIGN_STAGES[0],
  stages: CAMPAIGN_STAGES,
  copy: {
    base: {
      en: {
        atmospheric: 'Every city has stories waiting to happen.',
        subtitle: 'Creating something beautiful takes time.',
        email: 'hello@hello-along.com',
        copyright: '© 2025 Along',
        languageLabel: 'Language selector',
        closeLabel: 'Close note',
        noteListLabel: 'Campaign notes',
        campaignLabel: '21 Days to Life',
        notFoundTitle: 'Not yet.',
        notFoundBody: 'This note has not been published yet.',
      },
      es: {
        atmospheric: 'Cada ciudad tiene historias esperando suceder.',
        subtitle: 'Crear algo hermoso lleva tiempo.',
        email: 'hello@hello-along.com',
        copyright: '© 2025 Along',
        languageLabel: 'Selector de idioma',
        closeLabel: 'Cerrar nota',
        noteListLabel: 'Notas de campaña',
        campaignLabel: '21 Days to Life',
        notFoundTitle: 'Todavía no.',
        notFoundBody: 'Esta nota aún no ha sido publicada.',
      },
      ru: {
        atmospheric: 'У каждого города есть истории, которым ещё предстоит случиться.',
        subtitle: 'Чтобы создать что-то красивое, нужно время.',
        email: 'hello@hello-along.com',
        copyright: '© 2025 Along',
        languageLabel: 'Выбор языка',
        closeLabel: 'Закрыть заметку',
        noteListLabel: 'Заметки кампании',
        campaignLabel: '21 Days to Life',
        notFoundTitle: 'Пока нет.',
        notFoundBody: 'Эта заметка ещё не опубликована.',
      },
    },
    notes: {
      en: [
        {
          title: 'Hello, Along.',
          accent: '21 days.',
          tapLabel: 'tap to read ->',
          body: [
            "We're creating Along not so you spend more time on your phone.",
            'But so there is more worth doing beyond it.',
          ],
          emphasis: ['21 days.'],
          returnLine: 'Come back in three days.',
        },
      ],
      es: [
        {
          title: 'Hola, Along.',
          accent: '21 días.',
          tapLabel: 'toca para leer ->',
          body: [
            'Estamos creando Along no para que pases más tiempo en el teléfono.',
            'Sino para que haya más cosas interesantes fuera de él.',
          ],
          emphasis: ['21 días.'],
          returnLine: 'Vuelve dentro de tres días.',
        },
      ],
      ru: [
        {
          title: 'Hello, Along.',
          accent: '21 день.',
          tapLabel: 'нажми ->',
          body: [
            'Мы создаём Along не для того, чтобы ты проводил больше времени в телефоне.',
            'А чтобы интересного становилось больше за его пределами.',
          ],
          emphasis: ['21 день.'],
          returnLine: 'Загляни снова через три дня.',
        },
      ],
    },
  },
};
