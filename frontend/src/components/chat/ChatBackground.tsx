import './ChatBackground.css'

export default function ChatBackground() {
  return (
    <div className="chat-background" aria-hidden="true">
      {/* Soft radial glow in the center-top */}
      <div className="background-atmosphere" />

      {/* Abstract silhouette representing institutional presence (Building) */}
      <svg className="bis-building" viewBox="0 0 400 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 200V80h60v120h-60zm80 0V40h140v160H130zm160 0V80h60v120h-60zM150 60h30v30h-30V60zm50 0h30v30h-30V60zm-50 50h30v30h-30v-30zm50 0h30v30h-30v-30zm-50 50h30v30h-30v-30zm50 0h30v30h-30v-30z" />
      </svg>

      {/* Abstract silhouette representing environment (Trees) */}
      <svg className="bis-trees" viewBox="0 0 300 150" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M120 150v-40c-20 0-40-10-50-30-10-20-5-45 15-60 20-15 45-15 65 0 20 15 25 40 15 60-10 20-30 30-50 30v40h5zM50 150v-30c-15 0-30-5-40-20-10-15-5-35 10-45 15-10 35-10 50 0 15 10 20 30 10 45-10 15-25 20-40 20v30h10zM220 150v-45c-25 0-45-15-55-40-10-25-5-55 20-70 25-15 55-15 80 0 25 15 30 45 20 70-10 25-30 40-55 40v45h-10z" />
      </svg>

      {/* Overlapping Bottom Waves */}
      <svg className="background-waves" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Beige Wave */}
        <path
          className="wave-beige"
          fill="#F5EFEB"
          fillOpacity="0.8"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
        {/* Sky Blue Wave */}
        <path
          className="wave-secondary"
          fill="#C8D9E6"
          fillOpacity="0.6"
          d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
        {/* Teal Wave */}
        <path
          className="wave-main"
          fill="#567C8D"
          fillOpacity="0.15"
          d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,176C672,171,768,181,864,160C960,139,1056,85,1152,90.7C1248,96,1344,160,1392,192L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  )
}
