const trainers = [
  {
    name: 'Наталья',
    role: 'Группа по бачате • Растяжка',
    description:
      'Ведёт группу по бачате и занятия по растяжке. Помогает развивать технику, гибкость и уверенность в движении.',
    accent: 'text-fuchsia-300',
  },
  {
    name: 'Сергей',
    role: 'Протанцовка • Счастливый час',
    description:
      'Ведёт протанцовку и счастливый час. Помогает закреплять материал, чувствовать музыку и увереннее танцевать в паре.',
    accent: 'text-rose-300',
  },
  {
    name: 'Ксения',
    role: 'Группа по бачате',
    description:
      'Ведёт группу по бачате. Помогает ученикам мягко войти в танец, освоить базу и чувствовать себя комфортно на занятиях.',
    accent: 'text-pink-300',
  },
  {
    name: 'Джордж',
    role: 'Группа по бачате',
    description:
      'Ведёт группу по бачате. Объясняет понятную базу и помогает ученикам быстрее начать танцевать уверенно и в удовольствие.',
    accent: 'text-violet-300',
  },
  {
    name: 'Анастасия',
    role: 'Женский стиль • Группа по бачате',
    description:
      'Ведёт женский стиль и группу по бачате. Помогает раскрывать пластику, уверенность, выразительность и красоту движения.',
    accent: 'text-blue-300',
  },
  {
    name: 'Максим',
    role: 'Основатель студии',
    description:
      'Основатель студии. Формирует атмосферу, в которой комфортно расти с нуля, развиваться в танце и быть частью сильного сообщества.',
    accent: 'text-cyan-300',
  },
] as const;

function Logo() {
  return (
    <div className="mb-6 flex items-center">
      <img
        src="./logo.png"
        alt="МИД Студия танцев"
        className="h-auto w-[220px] object-contain md:w-[300px]"
      />
    </div>
  );
}

export default function App() {
  const signupUrl = 'https://vk.com/app6013442_-184393065?form_id=1#form_id=1';

  const handleSignup = () => {
    window.open(signupUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#2b1031] text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-fuchsia-600/35 blur-3xl" />
        <div className="absolute right-[10%] top-0 h-80 w-80 rounded-full bg-pink-500/35 blur-3xl" />
        <div className="absolute right-[18%] top-[18%] h-72 w-72 rounded-full bg-violet-500/35 blur-3xl" />
        <div className="absolute right-[6%] top-[32%] h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute left-[35%] top-[30%] h-72 w-72 rounded-full bg-rose-600/30 blur-3xl" />
        <div className="absolute bottom-[22%] right-[22%] h-72 w-72 rounded-full bg-pink-600/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%),linear-gradient(180deg,rgba(17,7,22,0.15),rgba(17,7,22,0.45))]" />
      </div>

      <div className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <Logo />
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
                Парная бачата, женский стиль и растяжка
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl">
                Удобные занятия после работы — с 18:00. Подходит для начинающих, в комфортной атмосфере и с понятным стартом.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={handleSignup} className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 text-base font-medium text-white shadow-xl transition hover:scale-[1.02]">
                  Записаться на «Бачата с нуля»
                </button>
                <button onClick={handleSignup} className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-base font-medium text-white shadow-xl backdrop-blur-md transition hover:scale-[1.02]">
                  Записаться на «Женский стиль с нуля»
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10">
              <h2 className="mb-4 text-2xl font-semibold text-white">Где находится студия</h2>
              <p className="text-lg leading-relaxed text-white/80">
                г. Волгоград, пр-т им. Ленина, 31 (Дом офицеров), 3 этаж, 59 аудитория
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5">
                <p className="font-medium text-white">Адрес студии:</p>
                <p className="mt-2 text-white/75">
                  г. Волгоград,<br />
                  пр-т им. Ленина, 31<br />
                  (Дом офицеров), 3 этаж, 59 аудитория
                </p>
              </div>
              <div className="mt-6 rounded-2xl border border-fuchsia-300/15 bg-fuchsia-500/10 p-5">
                <p className="font-medium text-white">Время занятий</p>
                <p className="mt-2 text-lg text-white/85">с 18:00 — удобно после работы</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Направления</h2>
            <p className="mt-3 text-lg text-white/70">Выберите направление и оставьте заявку на первое занятие.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col rounded-[2rem] border border-white/10 bg-white/10 p-7 shadow-xl backdrop-blur-xl">
              <div className="mb-3 text-sm font-medium text-fuchsia-300">Для начинающих</div>
              <h3 className="text-2xl font-semibold text-white">Бачата с нуля</h3>
              <p className="mt-4 flex-1 leading-relaxed text-white/70">Группа для тех, кто хочет начать танцевать с нуля в комфортном темпе и после рабочего дня.</p>
              <div className="mt-6 font-medium text-white/90">Занятия с 20:00</div>
              <button onClick={handleSignup} className="mt-6 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-3 text-base font-medium text-white shadow-xl transition hover:scale-[1.02]">
                Записаться на «Бачата с нуля»
              </button>
            </div>

            <div className="flex flex-col rounded-[2rem] border border-white/10 bg-white/10 p-7 shadow-xl backdrop-blur-xl">
              <div className="mb-3 text-sm font-medium text-pink-300">Для начинающих</div>
              <h3 className="text-2xl font-semibold text-white">Женский стиль с нуля</h3>
              <p className="mt-4 flex-1 leading-relaxed text-white/70">Направление для развития пластики, уверенности и красивого движения, даже если раньше вы не танцевали.</p>
              <div className="mt-6 font-medium text-white/90">Занятия с 19:00</div>
              <button onClick={handleSignup} className="mt-6 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 text-base font-medium text-white shadow-xl transition hover:scale-[1.02]">
                Записаться на «Женский стиль с нуля»
              </button>
            </div>

            <div className="flex flex-col rounded-[2rem] border border-white/10 bg-white/10 p-7 shadow-xl backdrop-blur-xl">
              <div className="mb-3 text-sm font-medium text-blue-300">Для тела и гибкости</div>
              <h3 className="text-2xl font-semibold text-white">Растяжка</h3>
              <p className="mt-4 flex-1 leading-relaxed text-white/70">Занятия для гибкости, лёгкости в движении и хорошего самочувствия, в удобное вечернее время.</p>
              <div className="mt-6 font-medium text-white/90">Занятия с 18:00</div>
              <button onClick={handleSignup} className="mt-6 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-base font-medium text-white shadow-xl transition hover:scale-[1.02]">
                Записаться на «Растяжку»
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Тренеры студии</h2>
            <p className="mt-3 text-lg text-white/70">Занятия ведут преподаватели, которые помогают расти в танце и чувствовать себя уверенно в группе.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {trainers.map((trainer) => (
              <div key={trainer.name} className="rounded-[2rem] border border-white/10 bg-white/10 p-7 shadow-xl backdrop-blur-xl">
                <div className={`mb-3 text-sm font-medium ${trainer.accent}`}>{trainer.role}</div>
                <h3 className="text-2xl font-semibold text-white">{trainer.name}</h3>
                <p className="mt-4 leading-relaxed text-white/70">{trainer.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <div className="grid items-center gap-8 rounded-[2rem] border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-xl md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">Приходите на занятия после работы</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">Вечерние группы с 18:00 — удобно встроить танцы и растяжку в свой график без спешки.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleSignup} className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 text-base font-medium text-white shadow-xl transition hover:scale-[1.02]">Записаться на «Бачата с нуля»</button>
              <button onClick={handleSignup} className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-base font-medium text-white backdrop-blur-md transition hover:scale-[1.02]">Записаться на «Женский стиль с нуля»</button>
              <button onClick={handleSignup} className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-base font-medium text-white backdrop-blur-md transition hover:scale-[1.02]">Записаться на «Растяжку»</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
