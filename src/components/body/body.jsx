
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import "./body.css";
import charityVideo from "../../assets/charity-video.mp4";

const messages = [  {
    headline: "Be the Reason Hope Survives",
    subtext: `
      In Gaza, families are trapped without food, medicine, or shelter. In Ukraine,
      millions live in ruins, displaced from the homes they once called safe. Around
      the world, children are orphaned by wars they did not choose.

      Your donation is not just money — it is food for the hungry, medicine for the weak,
      and safety for the displaced. When despair grows louder, your kindness becomes
      the voice of hope.

      Every time you give, you’re not only changing one life — you’re rebuilding communities,
      restoring dignity, and proving that love is stronger than war.
    `
  },
  {
    headline: "Every Second Counts. Every Gift Matters.",
    subtext: `
      Right now, a mother in Gaza is searching desperately for clean water for her child.
      A father in Ukraine is trying to rebuild after bombs tore his life apart. Refugees
      worldwide are fleeing violence, hunger, and poverty with nowhere to turn.

      You can be the answer they are praying for. Every gift — no matter the size —
      saves lives. In moments like these, every second, every act, every heart matters.

      Time is not just passing — it is deciding whether a child eats today, whether
      a family survives tonight, whether hope continues to exist tomorrow.
    `
  },
  {
    headline: "Compassion Has No Borders",
    subtext: `
      Wars and disasters don’t stop at borders, and neither should love. From conflict zones
      to refugee camps, from war victims to children left without parents, humanity is crying
      out for compassion.

      When you give, you cross borders without moving a step. You embrace the orphan, feed
      the hungry, and protect the displaced. Together, we can prove that kindness is stronger
      than war, and that unity is greater than division.

      Compassion is not about distance — it’s about connection. Your love travels where
      your feet cannot.
    `
  },
  {
    headline: "When the World Weeps, Your Heart Heals",
    subtext: `
      Gaza’s besieged families, Ukraine’s shattered homes, orphans with no safe place —
      their pain is real, their struggle urgent. Hope feels fragile, yet your generosity
      can turn despair into survival.

      You have the power to bring food where hunger rages, water where thirst overwhelms,
      and shelter where walls have crumbled. Compassion doesn’t wait — it acts, and today,
      it can start with you.

      In a broken world, your kindness is not just help — it is healing. It is proof that
      humanity still cares.
    `
  },
  {
    headline: "Hope is the Greatest Gift You Can Give",
    subtext: `
      Wars destroy homes, but they cannot destroy hope — unless we let them. Your donation
      today builds schools where rubble stands, delivers medicine where hospitals are gone,
      and restores dignity where suffering has stolen it.

      Hope is not an abstract idea — it is bread on a table, a safe blanket for a child,
      a future rebuilt from ashes. And only you can give it. Start today.

      Hope lives in action. When you give, you declare that darkness will not win.
    `
  },
  {
    headline: "When Nature Strikes, Humanity Must Answer",
    subtext: `
      Earthquakes tear apart cities. Floods wash away homes. Drought leaves entire villages
      without food or water. Natural disasters strike without warning, but compassion is
      always a choice.

      Families left homeless by floods, children starving from famine, and communities
      rebuilding after earthquakes all share one thing — the desperate need for help.

      Your gift today becomes shelter, food, and survival. Nature may break walls,
      but together we can rebuild lives.
    `
  },
  {
    headline: "No Child Should Suffer Alone",
    subtext: `
      Across war zones and disaster areas, children are paying the highest price.
      Orphaned, displaced, and robbed of their childhood, they need someone to fight
      for them when they cannot fight for themselves.

      Your support gives them food, safety, education, and the chance to dream again.
      You can be the reason a child believes in tomorrow.

      Every child deserves love, laughter, and life — and your kindness can give it back.
    `
  }
];
;

const Body = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate(); // <-- initialize navigate

  // Auto-rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-section">
      {/* Background Video */}
      <div className="video-container">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={charityVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlayed text */}
      <div key={index} className="text-content fade">
        <h1>{messages[index].headline}</h1>
        <p>{messages[index].subtext}</p>
        <button 
          className="donate-btn" 
          onClick={() => navigate("/donation")} // <-- navigate to donation page
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default Body;

