const AuthBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 620px at 6% 8%, rgba(255, 153, 102, 0.20), transparent 62%), radial-gradient(900px 560px at 92% 10%, rgba(88, 208, 255, 0.20), transparent 58%), radial-gradient(780px 460px at 50% 100%, rgba(91, 115, 255, 0.22), transparent 60%), linear-gradient(160deg, #0b1322 0%, #0f1b33 45%, #111a2f 100%)",
        }}
      />

      <div className="absolute -left-16 top-14 h-80 w-80 rounded-full bg-[#ff9966]/22 blur-3xl animate-[authDriftA_20s_ease-in-out_infinite]" />
      <div className="absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-[#58d0ff]/20 blur-3xl animate-[authDriftB_24s_ease-in-out_infinite]" />
      <div className="absolute left-1/3 -bottom-48 h-112 w-md rounded-full bg-[#6474ff]/24 blur-3xl animate-[authDriftC_22s_ease-in-out_infinite]" />

      <div className="absolute left-1/2 top-1/2 h-96 w-160 max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.10),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(2,8,24,0.72)_100%)]" />

      <style>{`
        @keyframes authDriftA {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(24px, -18px, 0) scale(1.05); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes authDriftB {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-28px, 20px, 0) scale(1.06); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes authDriftC {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(14px, -20px, 0) scale(1.04); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AuthBackground;
