import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, ChevronLeft, ChevronRight, Menu, X, Home, 
  BookMarked, ScrollText, FileText, ExternalLink, Volume2, VolumeX, Pause, Play, Download 
} from "lucide-react";
import { Link } from "wouter";

type Chapter = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type Volume = {
  id: string;
  title: string;
  subtitle: string;
  chapters: Chapter[];
};

const volume1Chapters: Chapter[] = [
  {
    id: "v1-foreword",
    title: "Foreword",
    content: (
      <>
        <p className="text-xl italic text-slate-300 mb-6">You weren't supposed to read this book.</p>
        <p>Not because it contains state secrets or classified information. But because the system that has operated for millennia depends on you never connecting the dots. Never seeing the patterns. Never asking why the same inversions appear across every institution, every religion, every era of history.</p>
        <p>This book will be called "conspiracy theory." That term was created by the CIA in 1967 specifically to discredit people who ask questions. You'll find the declassified document referenced in the appendix. That's not opinion. That's documented history.</p>
        <p>What follows is not doctrine. It is not the final word on anything. It is a collection of patterns, questions, and connections that the reader is encouraged to verify independently. Where claims can be documented, sources are provided. Where claims are speculative, they are labeled as such.</p>
        <p>The goal is not to create followers but to awaken seekers. Not to replace one set of authorities with another but to encourage direct relationship with the Creator and direct engagement with truth.</p>
        <p>Some of this will resonate immediately. Some will seem absurd at first and make sense later. Some may never land. That's fine. Take what serves your awakening. Question everything else - including this.</p>
        <p>The signal has been broadcasting since the beginning. The receiver can be restored. The veil can be lifted.</p>
        <p className="text-cyan-400 mt-6">What happens next is between you and the Most High.</p>
      </>
    )
  },
  {
    id: "v1-preface",
    title: "Preface: A Word About This Work",
    content: (
      <>
        <p>This book is based on research. On world events. On historical precedent. On patterns that keep appearing across cultures, centuries, and continents.</p>
        <p>We are not making definitive claims.</p>
        <p>We are presenting what is understood. What is known. What is circulating. What has been published and documented - some accepted, some suppressed, some dismissed without examination.</p>
        <p>Think of truth as a massive puzzle - not one tidy box with matching pieces, but fragments from a hundred different puzzles scattered across time and geography. You can shake that box for a billion years hoping it assembles itself. Or you can start connecting pieces that fit, building a tapestry that reveals a picture.</p>
        <p>That's what this book offers: a connect-the-dots model. If a piece fits the pattern, it's probably part of the larger picture. If it doesn't, set it aside. The goal isn't to convince you of anything. The goal is to show you how we connected the dots - and invite you to verify, challenge, or expand on what we've found.</p>
        <div className="border-l-4 border-purple-500/50 pl-4 my-6 italic">
          <p>"You're a conspiracy theorist" translates to: "Your observations will not be considered. Your evidence will not be examined. You have been categorized as defective, and nothing you say matters."</p>
        </div>
        <p>The social cost of receiving this label is severe. Employment affected. Relationships strained. Platform access revoked. The questioner is effectively exiled from acceptable society - not for being wrong, but for asking.</p>
        <p>This is the function of the term. Not to evaluate claims, but to prevent evaluation. Not to seek truth, but to protect narratives. Not to engage, but to dismiss.</p>
        <p>The antidote is simple: "What specifically in what I said is incorrect?" Force engagement with the content. Refuse the label's power to end the conversation.</p>
      </>
    )
  },
  {
    id: "v1-part1",
    title: "Part One: The Rebellion",
    content: (
      <>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">Chapter 1: The Council and The Fall</h3>
        <p>Before the beginning there was a council. Before humanity walked the earth, decisions were made that would shape everything to come.</p>
        <p>The Hebrew scriptures describe this council - the divine assembly where the Most High presided over the elohim, the heavenly beings who served various functions in creation's governance. This isn't metaphor. The language is explicit.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="text-cyan-300 font-medium">Tehilliym (Psalms) 82:1</p>
          <p className="italic">"Elohiym stands in the assembly of El; he judges among the elohiym."</p>
        </div>
        <p>Among these beings, some were given authority over nations. Some were assigned to watch over humanity. Some rebelled.</p>
        <p>The rebellion wasn't a single event. It was a process - a gradual corruption that began with desire and ended with catastrophe.</p>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 mt-8">Chapter 2: The 200 Watchers</h3>
        <p>The Book of Chanoch (Enoch) names them. Two hundred watchers who descended on Mount Hermon and made a pact - to take human wives and teach humanity secrets that were not meant to be known.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="text-cyan-300 font-medium">Chanoch (Enoch) 6:1-6</p>
          <p className="italic">"And it came to pass when the children of men had multiplied that in those days were born unto them beautiful and comely daughters. And the angels, the children of the heaven, saw and lusted after them..."</p>
        </div>
        <p>Their leader was Shemyaza. Their teachers included Azazel, who taught weapons and cosmetics; Amazarak, who taught sorcery; and others who revealed astrology, enchantments, and the cutting of roots.</p>
        <p>The result was the Nephilim - giants, heroes of old, men of renown. And corruption so complete that the Creator grieved having made humanity at all.</p>
      </>
    )
  },
  {
    id: "v1-part2",
    title: "Part Two: The Resets",
    content: (
      <>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">The Flood and What Came After</h3>
        <p>The Flood wasn't just judgment. It was a reset. A wiping clean of corruption that had become too deep to fix any other way.</p>
        <p>But here's what most don't consider: it wasn't the only reset.</p>
        <p>History records multiple cataclysms. Multiple moments when civilization was wiped clean and started again. The Flood of Noah is the most famous, but the pattern continues.</p>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 mt-8">Tartaria and the Mud Flood</h3>
        <p>Look at old photographs of major cities - Chicago, San Francisco, Melbourne. Notice something strange: the first floors of magnificent buildings are buried. Windows that should be at street level are underground. Doors open to nothing.</p>
        <p>The official explanation: settling. Poor construction. Deliberate burial for various reasons.</p>
        <p>The pattern: a global event deposited feet of mud across entire continents, burying the ground floors of a previous civilization. Then history was rewritten to erase what came before.</p>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 mt-8">The Orphan Trains</h3>
        <p>Between 1854 and 1929, approximately 250,000 children were transported from East Coast cities to the Midwest and beyond. The official story: these were homeless orphans being given new opportunities with rural families.</p>
        <p>The questions: Why so many orphans at the same time? Why were their records often destroyed or falsified? Why do so many of these "orphans" have no memory of parents dying, only of being separated from families they clearly remember?</p>
        <p>What if these weren't orphans at all, but children of a previous civilization whose parents were eliminated and whose histories were erased?</p>
      </>
    )
  },
  {
    id: "v1-part3",
    title: "Part Three: The Great Substitution",
    content: (
      <>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">The Name That Was Erased</h3>
        <p>The Father's name - Yahuah (יהוה) - appears over 6,800 times in the original Hebrew scriptures.</p>
        <p>It was systematically replaced with "LORD" and "GOD" - titles that could apply to anyone or anything. The most sacred name in existence, given directly to Moses at the burning bush, erased and replaced with generic terms.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p className="text-purple-300 font-medium">Shemoth (Exodus) 3:15</p>
          <p className="italic">"And Elohiym said moreover unto Mosheh, Thus shall you say unto the children of Yashar'el, Yahuah Elohiym of your fathers, the Elohiym of Avraham, the Elohiym of Yitschaq, and the Elohiym of Ya'aqov, has sent me unto you: this is my name forever, and this is my memorial unto all generations."</p>
        </div>
        <p>His name forever. His memorial to all generations. Erased 6,800 times and replaced with titles.</p>
        <p>This wasn't accidental. This was systematic. And it happened across every major translation, in every language, for centuries.</p>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 mt-8">The Messiah's True Name</h3>
        <p>The Messiah's name is Yahusha - literally "Yahuah saves" or "Yahuah is salvation." The name contains the Father's name within it. That's what "coming in the Father's name" means.</p>
        <p>This name was changed to "Iesous" in Greek, then to "Jesus" in English - a name that didn't exist until about 400 years ago. The letter J wasn't even in the English alphabet until the 17th century.</p>
        <p>The transliteration chain: Yahusha → Yeshua → Iesous → Jesus. Each step removed the name further from its original meaning and frequency.</p>
      </>
    )
  },
  {
    id: "v1-part4",
    title: "Part Four: The Control Systems",
    content: (
      <>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">Bloodlines and Thrones</h3>
        <p>The same families have controlled power for centuries. Not the same names always - names change, merge, disappear into trusts and foundations. But trace the bloodlines and the same DNA keeps appearing at the top of every major institution.</p>
        <p>This isn't conspiracy theory. It's genealogy. It's documented. The question isn't whether it's true - the question is why it's true, and what it means.</p>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 mt-8">The Inversion Pattern</h3>
        <p>Everything the Creator made, the adversary inverts. Light becomes darkness. Truth becomes lie. Healing becomes harm. Protection becomes control.</p>
        <p>Look at any major system:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Medicine:</strong> Designed to heal, now often creates dependency and manages symptoms rather than curing causes.</li>
          <li><strong>Education:</strong> Designed to develop thinking, now produces conformity and suppresses questions.</li>
          <li><strong>Religion:</strong> Designed to connect with the Creator, now often separates and controls.</li>
          <li><strong>Government:</strong> Designed to serve the people, now serves itself and its controllers.</li>
          <li><strong>Media:</strong> Designed to inform, now programs and divides.</li>
        </ul>
        <p>The pattern is consistent because the playbook is consistent. Duplicate the original. Then invert it. Make it look the same while doing the opposite.</p>
      </>
    )
  },
  {
    id: "v1-part5",
    title: "Part Five: The Awakening",
    content: (
      <>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">Restoring the Receiver</h3>
        <p>The pineal gland - the "third eye" - was understood by ancient cultures to be the seat of spiritual perception. Modern science confirms it contains the same photoreceptors as the physical eyes. It responds to light even in darkness.</p>
        <p>Jacob named the place where he wrestled with the angel "Peniel" - literally "face of God." The connection is not accidental.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="text-cyan-300 font-medium">Mattithyahu (Matthew) 6:22</p>
          <p className="italic">"The light of the body is the eye: if therefore your eye be single, your whole body shall be full of light."</p>
        </div>
        <p>What calcifies the pineal? Fluoride (in water and toothpaste), processed foods, certain medications, alcohol, lack of sunlight. What decalcifies it? Clean water, natural foods, sunlight, meditation, fasting.</p>
        <p>The receiver can be restored. The signal is still broadcasting.</p>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 mt-8">The Two Requirements</h3>
        <p>After all the research, all the connections, all the layers peeled back - what does the Creator actually require?</p>
        <p className="text-xl text-cyan-300 my-4"><strong>1. Call Him By His Name</strong></p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="text-cyan-300 font-medium">Yo'el (Joel) 2:32</p>
          <p className="italic">"And it shall come to pass, that whosoever shall call on the name of Yahuah shall be delivered."</p>
        </div>
        <p className="text-xl text-cyan-300 my-4"><strong>2. Keep His Commandments</strong></p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="text-cyan-300 font-medium">Yahuchanon (John) 14:15</p>
          <p className="italic">"If you love me, keep my commandments."</p>
        </div>
        <p>That's it. Two things. Not complicated. Not requiring seminary education or institutional membership. Call Him by His name. Keep His commandments.</p>
      </>
    )
  },
  {
    id: "v1-appendix",
    title: "Appendix: About the Cepher Translation",
    content: (
      <>
        <h3 className="text-2xl font-bold text-purple-400 mb-4">Why This Book Uses the Cepher</h3>
        <p>Throughout this work, scripture quotations come from the Cepher translation. Many readers will be unfamiliar with this text, as it stands outside the mainstream Bible translations promoted by institutional Christianity. This is not accidental. The Cepher restores what was systematically removed.</p>
        
        <h4 className="text-xl font-bold text-cyan-400 mt-6 mb-3">The Restoration of Set-Apart Names</h4>
        <p><strong>The Name of the Father: Yahuah</strong></p>
        <p>The Cepher restores the Father's name as Yahuah (יהוה). This name went unmentioned for over two millennia based on the "ineffable name doctrine" - a rabbinical teaching that the name was too sacred to pronounce. However, scripture itself directly contradicts this.</p>
        <p>The pronunciation is constructed from four vowels: ee (yod) - ah (heh) - oo (vav) - ah (heh) = Yahuah.</p>
        
        <p className="mt-4"><strong>The Name of the Son: Yahusha</strong></p>
        <p>The Messiah's name is restored as Yahusha (יהושע), not "Jesus." This name is identical to the Hebrew name of the son of Nun who led Israel into the Promised Land - the one English Bibles call "Joshua."</p>
        <p>The name Yahusha is constructed from two Hebrew words: Yahuah (יהוה) and yasha (ישע), meaning "to save, deliver." Thus, the name literally means "Yahuah saves."</p>
        
        <h4 className="text-xl font-bold text-cyan-400 mt-6 mb-3">The Removed Books</h4>
        <p>The Cepher includes books removed by the Westminster Confession:</p>
        <ul className="list-disc pl-6 space-y-1 my-4">
          <li>Cepher Chanoch (Enoch)</li>
          <li>Cepher Yovheliym (Jubilees)</li>
          <li>Cepher ha'Yashar (Jasher)</li>
          <li>Cepheriym Makkabiym (Maccabees)</li>
          <li>And others from the original canon</li>
        </ul>
        <p>These were included in the 1611 King James Bible. The reduction to 66 books was a political decision, not a theological one.</p>
        <p className="mt-4 text-cyan-400">We encourage readers to obtain the complete Cepher at <strong>cepher.net</strong></p>
      </>
    )
  }
];

const volume2Chapters: Chapter[] = [
  {
    id: "v2-authors-note",
    title: "Author's Note",
    content: (
      <>
        <p>I grew up in Baptist and Methodist churches. I was baptized, attended Sunday school, went to revivals. I did the things you're supposed to do.</p>
        <p>But even as a child, something didn't fit.</p>
        <p>The message I was given and the visuals I saw didn't match. The words said one thing; the imagery suggested another. And the answers I received when I asked questions always ended the same way: "You're not supposed to understand everything. That's what faith is for."</p>
        <p>I was told to imagine a fence with something on the other side. All I had was a knothole to peek through. I was supposed to see just enough to build faith in what I couldn't fully comprehend, then live my life based on that glimpse.</p>
        <p>But that never made sense to me.</p>
        <p>How could a loving Creator - one who made us above the angels, in His own image, with the ability to create - give us only partial information? How could He expect us to guess our way through the most important decision of our existence?</p>
        <p>So I pushed away. Tried to be my own god. Fell flat on my face. Over and over. Studied with different denominations. Found some that made more sense than others. But none of them made total sense.</p>
        <p className="text-cyan-400 font-medium mt-6">Until now.</p>
        <p>After decades of confusion, addiction, and searching - and after finally clearing my mind long enough to receive something beyond my own noise - the dots connected. Not through religious dogma. Not through institutional doctrine. Through careful study, honest questioning, and suddenly... clarity.</p>
        <p>What I'm presenting in this book is not an attack on Christianity. It's not heresy designed to create a flashpoint. It's not me trying to change your mind.</p>
        <p>It's simply what made sense when I finally allowed myself to look.</p>
        <div className="border-t border-b border-slate-600 my-8 py-6">
          <p>I'm asking you to consider whether the faith you were given has been corrupted - and whether the truth that was always there has simply been veiled.</p>
          <p>If what I'm saying resonates, explore it. If it doesn't, set it aside. That's between you and your own discernment.</p>
        </div>
        <p className="text-right italic text-slate-400">Asher Reed<br/>January 2026</p>
      </>
    )
  },
  {
    id: "v2-part1",
    title: "Part One: The Fog and The Lifting",
    content: (
      <>
        <p>For a long time, I was lost in addiction. And then, when the addiction ended, I found myself even more lost - because instead of drowning my confusion, I suddenly had to face it. The fog was thick. I couldn't see past it. I knew something wasn't right about the world, about the systems, about what we've been told. But I couldn't articulate it. I couldn't break through.</p>
        <p>The first instinct that came when the fog started lifting was not about myself. It was about giving back. Helping animals. Helping people who've been hurt. That surprised me, because I expected to be focused on rebuilding myself. But I realized that giving back IS focusing on yourself - the true self, not the wounded one. When you're aligned with purpose, you heal.</p>
        <p>And then the insights started coming. Not all at once. In waves. Some days I'd wake up and feel like I'd forgotten everything from the day before. Then suddenly, more clarity than I'd ever had would flood in.</p>
        <p>I don't know if this is me figuring things out, or if I'm receiving transmissions from somewhere else. But I've learned to document it when it comes, because it doesn't always stay.</p>
      </>
    )
  },
  {
    id: "v2-part2",
    title: "Part Two: The Language Trap",
    content: (
      <>
        <p>Here's something that seems small but isn't: the word "cryptocurrency."</p>
        <p>Crypto means hidden. Currency means a method of exchange. So the term literally means "hidden money." And that framing does two things.</p>
        <p>First, it scares away spiritual and traditional people. Many believers were taught to fear a "one world currency" as a sign of the end times. So when they hear "cryptocurrency," they instinctively resist it. They think they're fighting the beast. Meanwhile, the actual one-world currency - the petrodollar - has been running the global economy for sixty years. Nobody calls it that because the framing protects it. The real threat operates in plain sight while people fight the decoy.</p>
        <p>Second, the "currency" label attracts speculators. People who just want numbers to go up. They don't care about the technology or what it could enable. They want to gamble. And the system loves this, because gamblers are easy to manipulate.</p>
        <p>So the language itself filters out the discerning and attracts the distracted. That's not an accident.</p>
      </>
    )
  },
  {
    id: "v2-part12",
    title: "Part Twelve: Fear as the Weapon",
    content: (
      <>
        <p>Everything in this system is fear-based. And that's not an accident.</p>
        <p>Fear is the top-shelf emotion. It's meant for one thing: survival. Fight or flight. When a predator is chasing you, fear saves your life. It makes you react instantly, without thinking. That's what it's for.</p>
        <p>But here's what they figured out: if you can trigger that same fear response when there's no real danger, you can control people. Make them react without thinking. Make them accept things they would never accept if they were calm and discerning.</p>
        <p>So they built a system on fear. Fear of hell. Fear of missing out. Fear of being left behind. Fear of being wrong. Fear of punishment. Fear of exclusion. Every decision made from that fear state ends up being a mistake - because fear bypasses discernment. It goes straight to reaction.</p>
        <p>The religious version is brilliant in its cruelty. Believe this or burn forever. Accept this into your heart or face eternal torment. It hijacks the survival instinct and points it at your soul. You're not running from a bear - you're running from an idea they planted in your head.</p>
        <p>Sadness is different. Sadness is a real response to loss, to something that affects you deeply. It has purpose. It processes grief. But fear - fear is a tool. And in the wrong hands, it becomes a weapon.</p>
      </>
    )
  },
  {
    id: "v2-part13",
    title: "Part Thirteen: The Mark and The Names",
    content: (
      <>
        <p>People think the mark of the beast is a microchip. A barcode. Some physical technology implanted in the body. They're waiting for it, ready to resist it.</p>
        <p>But what if it's already here? What if it's been here for centuries?</p>
        <p>The scripture says the mark will be in your forehead and in your hand. The forehead is where you think - your beliefs, your heart. The hand is what you do - your works, your actions. It's not a chip. It's acceptance and obedience.</p>
        <p>The prayer to accept the false messiah into your heart. The works done in his name. That's the mark. It's organic. It's spiritual. And most people took it willingly, thinking they were doing right.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p className="italic">"Lord, Lord, we prophesied in your name, we cast out demons in your name, we did mighty works in your name." And the response: "Depart from me, I never knew you."</p>
        </div>
        <p>Why? Because the name matters. The name carries the frequency. The name is the connector to the source. And if you've been given a corrupted name - a substitution, a translation that removes the power - then you're connecting to something else entirely.</p>
        <p>The Father's name appears over 6,800 times in the original Hebrew scriptures. It was replaced with "LORD" and "GOD" - titles, not names. The Messiah's name was changed, translated, modified until it no longer resonates with what was given.</p>
        <p>The wicked pattern is always the same: duplicate the truth, then invert it subtly. Make it look almost the same so people accept it. But the subtle difference changes everything. That's how the false passes for the true.</p>
      </>
    )
  },
  {
    id: "v2-part20",
    title: "Part Twenty: The Spark of Life",
    content: (
      <>
        <p>Science recently captured something remarkable: when a sperm enters an egg, there is a visible flash of light.</p>
        <p>A flash. At the moment of conception.</p>
        <p>They call it a zinc spark. They measure it. They explain it in chemical terms. But think about what it is: the moment life begins, there is light.</p>
        <p>That's the spark. That's the breath of life entering the biological suit. That's the promise coming to pass.</p>
        <p>Originally, we were meant to live eternally. Just follow the law. Fellowship with the Creator. Exist in the garden. But corruption came - the corruption of DNA through the fallen, the mixing of what shouldn't have been mixed - and here we are.</p>
        <p>But even now, even in this corrupted state, every new life begins with a flash of light. The signature of the Creator remains, even in a fallen world.</p>
        <p>Science sees it and calls it chemistry. But if you have eyes to see, you know what it is. The spark isn't zinc. It's the beginning of a soul.</p>
      </>
    )
  },
  {
    id: "v2-part21",
    title: "Part Twenty-One: The Real Corruption",
    content: (
      <>
        <p>People think death came because Adam and Eve ate an apple. That's the story they tell. A bite of fruit, and suddenly the Creator said: now you die.</p>
        <p>But that's the shortened version. The metaphor simplified to the point of losing its meaning.</p>
        <p>The fruit wasn't about an apple. It was about the choice to do what was told not to do - the same parallel to Lucifer and the fallen wanting what wasn't theirs. They wanted to attain the knowledge of the Creator, to surpass him.</p>
        <p>What actually happened was genetic corruption. The mixing of bloodlines. The perfect creation was corrupted by entities that wanted what humans were given - a ranking above the angels, made in the image of the Creator with the ability to create.</p>
        <p>That corruption - the mixing of what shouldn't have been mixed - is what brought death. Not a vindictive punishment. A corrupted system failing. A perfect design broken.</p>
        <p>And instead of total destruction, instead of wiping out his most prized creation, the Creator sent redemption. The Messiah wasn't sent to condemn. He was sent to restore what was corrupted. To offer a way back.</p>
        <p>But they tell it differently. They make the Creator sound petty. They make it about obedience and punishment. They leave out the rebellion, the corruption, the actual mechanics of what went wrong.</p>
        <p>The real story makes sense. They just don't tell it.</p>
      </>
    )
  },
  {
    id: "v2-part22",
    title: "Part Twenty-Two: The Point of the Spear",
    content: (
      <>
        <p>Christianity is the largest religion in the world. The Catholic Church sits at its head. Billions follow.</p>
        <p>And it's presented as persecuted.</p>
        <p>Think about that. The dominant world religion, spanning every continent, commanding massive wealth and political influence, framing itself as the underdog. The persecuted faithful, scorned by the world, holding onto truth against all odds.</p>
        <p>This framing gives moral credence. It justifies. It positions. It allows the largest, most powerful religious institution on Earth to claim victimhood while wielding enormous power.</p>
        <p>I call Christianity the point of the spear not because it's evil, but because it's been weaponized. The original faith - the actual teachings, the real names, the true understanding - was corrupted through Constantine and his vision of the cross in the sky. World domination dressed as divine mandate. Rome's reach extended through religious conversion.</p>
        <p>What emerged wasn't the original. It was an institution designed to control, using the scaffolding of truth to build a prison of lies.</p>
        <p>And the prophecy? Yes, there was a prophecy about a world religion. But when it was given, there was no name attached. The discernment was clear: something would spread across the Earth claiming to represent the Creator. The name would come later - created by the deception itself.</p>
      </>
    )
  },
  {
    id: "v2-part24",
    title: "Part Twenty-Four: Why I'm Not Hiding",
    content: (
      <>
        <p>I could use a pen name. Stay anonymous. Present these ideas without putting myself in the firing line.</p>
        <p>But that would put me in the same category as those I'm questioning. If I'm asking you to be honest with yourself, to question what you've been taught, to risk your perceived soul for the sake of truth - and I can't even reveal my own name? Who would take that seriously?</p>
        <p>I'm not rewriting scripture. I would never add to or take away from what's there. But I am suggesting that they have taken away - massively - from the original. The modern church gives the warning that only their version is truth while looking at texts that have been curated, edited, translated, and stripped of context.</p>
        <p>So yes, this will be called heresy by some. Speaking against Christianity while claiming to seek the same Creator they claim to serve - that's the highest crime in religious circles. But here's the thing:</p>
        <p>In the end, I'm going to live and die just like everyone else. And it won't be because Adam ate an apple. It'll be because the system was corrupted and I'm living in the aftermath of that corruption, just like all of us.</p>
        <p>If speaking the truth as I see it costs me something, so be it. The alternative is silence. And silence, in the face of what I now see, would be its own kind of betrayal.</p>
      </>
    )
  },
  {
    id: "v2-closing",
    title: "Closing Thoughts",
    content: (
      <>
        <p>I don't know where all this is coming from. Some days it feels like it's me figuring things out. Other days it feels like transmission - receiving something from somewhere else. Maybe it's both.</p>
        <p>What I know is that I'm supposed to document it. To speak it. To build something that embodies it. Not for fame or recognition. But because this is what I'm here for.</p>
        <p className="text-cyan-400 font-medium my-6">The messenger isn't the point. The message does the work.</p>
        <p>And maybe, just maybe, if enough people start seeing through the veil, we can build something different. Not controlled by the masters. Not designed to confuse. Just honest infrastructure for humans to connect, trust each other, and be free.</p>
        <p>That's the mission.</p>
        <div className="text-center mt-12 p-6 border border-slate-600 rounded-lg">
          <p className="text-xl font-medium mb-2">To Be Continued...</p>
          <p className="text-slate-400">There's more coming. This is just what's arrived so far.</p>
          <p className="text-slate-400">When the next wave of clarity comes, it will be added here.</p>
          <p className="text-cyan-400 mt-4">You're not alone in this search. Keep listening.</p>
        </div>
        <p className="text-center mt-8 text-slate-500">
          All glory to Yahuah, the Most High. All honor to Yahusha, the Son.<br/>
          HalleluYah.
        </p>
      </>
    )
  }
];

const volumes: Volume[] = [
  {
    id: "volume1",
    title: "Volume One",
    subtitle: "Through The Veil: The Evidence",
    chapters: volume1Chapters
  },
  {
    id: "volume2",
    title: "Volume Two",
    subtitle: "My Journey Beyond the Veil",
    chapters: volume2Chapters
  }
];

export default function VeilReader() {
  const [currentVolume, setCurrentVolume] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const handleDownloadPDF = () => {
    const volumeNum = currentVolume + 1;
    const volumeTitle = currentVolume === 0 ? "Volume-1-Research" : "Volume-2-Testimony";
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const volumeData = currentVolume === 0 ? VOLUME_1 : VOLUME_2;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Through The Veil - ${volumeTitle}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #222; }
            h1 { font-size: 28px; margin-top: 60px; page-break-before: always; }
            h1:first-of-type { page-break-before: avoid; }
            h2 { font-size: 22px; margin-top: 40px; color: #444; }
            p { margin: 16px 0; text-align: justify; }
            blockquote { border-left: 3px solid #666; padding-left: 20px; margin: 20px 0; font-style: italic; color: #555; }
            .title-page { text-align: center; padding: 100px 0; page-break-after: always; }
            .title-page h1 { page-break-before: avoid; font-size: 36px; }
            .note { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="title-page">
            <h1>Through The Veil</h1>
            <p style="font-size: 20px; margin-top: 20px;">${currentVolume === 0 ? 'Volume One: Documented Research' : 'Volume Two: Personal Testimony'}</p>
            <p style="margin-top: 40px; color: #666;">By Asher Reed</p>
            <p style="margin-top: 60px; color: #888; font-size: 14px;">Note: This PDF version may not include cross-references and interactive features available at dwtl.io/veil/read</p>
          </div>
          <div class="no-print" style="background: #fffbe6; padding: 15px; margin-bottom: 30px; border-radius: 8px;">
            <strong>To save as PDF:</strong> Press Ctrl+P (or Cmd+P on Mac), then select "Save as PDF" as your printer.
          </div>
          ${volumeData.chapters.map(ch => `
            <h1>${ch.title}</h1>
            <div>${typeof ch.content === 'string' ? ch.content : 'Content available in web reader'}</div>
          `).join('')}
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
  }, [currentVolume, currentChapter]);

  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (!node) return '';
    if (Array.isArray(node)) return node.map(extractText).join(' ');
    if (typeof node === 'object' && 'props' in node) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      return extractText(element.props?.children);
    }
    return '';
  };

  const playWithBrowserSpeech = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Google US English') ||
      v.lang.startsWith('en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    setIsLoading(false);
  };

  const playWithElevenLabs = async (text: string) => {
    try {
      setIsLoading(true);
      
      // Truncate to 5000 chars for API limit
      const truncatedText = text.slice(0, 5000);
      
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: truncatedText }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (error.fallback) {
          console.log('ElevenLabs unavailable, falling back to browser voice');
          setUseElevenLabs(false);
          playWithBrowserSpeech(text);
          return;
        }
        throw new Error(error.error || 'Voice generation failed');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        URL.revokeObjectURL(audioUrl);
        // Auto-advance to next chapter if enabled
        if (autoAdvance) {
          setTimeout(() => {
            const vol = volumes[currentVolume];
            if (currentChapter < vol.chapters.length - 1) {
              setCurrentChapter(currentChapter + 1);
              window.scrollTo(0, 0);
            } else if (currentVolume < volumes.length - 1) {
              setCurrentVolume(currentVolume + 1);
              setCurrentChapter(0);
              window.scrollTo(0, 0);
            }
          }, 1500); // Short pause before next chapter
        }
      };
      
      audio.onerror = () => {
        console.log('Audio error, falling back to browser voice');
        setUseElevenLabs(false);
        playWithBrowserSpeech(text);
      };
      
      await audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      setIsLoading(false);
      
    } catch (error) {
      console.error('ElevenLabs error:', error);
      setUseElevenLabs(false);
      playWithBrowserSpeech(text);
    }
  };

  const handlePlay = async () => {
    // Resume if paused
    if (isPaused) {
      if (audioRef.current) {
        await audioRef.current.play();
        setIsPaused(false);
        setIsPlaying(true);
        return;
      }
      if (utteranceRef.current) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
        return;
      }
    }

    const text = extractText(chapter.content);
    
    if (useElevenLabs) {
      await playWithElevenLabs(text);
    } else if (speechSupported) {
      playWithBrowserSpeech(text);
    }
  };

  const handlePause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const volume = volumes[currentVolume];
  const chapter = volume.chapters[currentChapter];
  
  const totalChapters = volumes.reduce((acc, v) => acc + v.chapters.length, 0);
  const currentGlobalIndex = volumes.slice(0, currentVolume).reduce((acc, v) => acc + v.chapters.length, 0) + currentChapter;

  const goNext = () => {
    if (currentChapter < volume.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    } else if (currentVolume < volumes.length - 1) {
      setCurrentVolume(currentVolume + 1);
      setCurrentChapter(0);
    }
    window.scrollTo(0, 0);
  };

  const goPrev = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    } else if (currentVolume > 0) {
      setCurrentVolume(currentVolume - 1);
      setCurrentChapter(volumes[currentVolume - 1].chapters.length - 1);
    }
    window.scrollTo(0, 0);
  };

  const goToChapter = (volIndex: number, chapIndex: number) => {
    setCurrentVolume(volIndex);
    setCurrentChapter(chapIndex);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const hasNext = currentChapter < volume.chapters.length - 1 || currentVolume < volumes.length - 1;
  const hasPrev = currentChapter > 0 || currentVolume > 0;

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-xs text-cyan-400">{volume.title}</p>
              <p className="text-sm text-white font-medium truncate max-w-[200px] md:max-w-none">{chapter.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {(speechSupported || useElevenLabs) && (
              <div className="flex items-center gap-1">
                {isLoading && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled
                    className="text-cyan-400"
                  >
                    <div className="w-4 h-4 mr-1 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span className="hidden md:inline text-xs">Loading...</span>
                  </Button>
                )}
                {!isPlaying && !isPaused && !isLoading && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePlay}
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    title="Listen to this chapter (AI Voice)"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    <span className="hidden md:inline text-xs">Listen</span>
                  </Button>
                )}
                {isPlaying && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePause}
                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    title="Pause"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                )}
                {isPaused && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePlay}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                    title="Resume"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                )}
                {(isPlaying || isPaused) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleStop}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    title="Stop"
                  >
                    <VolumeX className="w-4 h-4" />
                  </Button>
                )}
                <button
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`hidden md:flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    autoAdvance 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-slate-700/50 text-slate-500 hover:text-slate-300'
                  }`}
                  title={autoAdvance ? "Auto-advance ON - will play next chapter automatically" : "Auto-advance OFF"}
                >
                  <span>Auto</span>
                </button>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownloadPDF}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              title="Download as PDF"
            >
              <Download className="w-4 h-4" />
            </Button>
            <span className="text-xs text-slate-500 hidden md:block">
              {currentGlobalIndex + 1} of {totalChapters}
            </span>
            <Link href="/veil">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 z-50 overflow-y-auto border-r border-slate-800"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Contents</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {volumes.map((vol, volIndex) => (
                <div key={vol.id} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {volIndex === 0 ? (
                      <ScrollText className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <BookMarked className="w-4 h-4 text-purple-400" />
                    )}
                    <h3 className={`font-semibold ${volIndex === 0 ? 'text-cyan-400' : 'text-purple-400'}`}>
                      {vol.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{vol.subtitle}</p>
                  
                  <div className="space-y-1">
                    {vol.chapters.map((chap, chapIndex) => (
                      <button
                        key={chap.id}
                        onClick={() => goToChapter(volIndex, chapIndex)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          currentVolume === volIndex && currentChapter === chapIndex
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {chap.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="pt-20 pb-24 px-4">
        <motion.div
          key={`${currentVolume}-${currentChapter}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <span className={`text-sm ${currentVolume === 0 ? 'text-cyan-400' : 'text-purple-400'}`}>
              {volume.title}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{chapter.title}</h1>
          </div>

          <div className="prose prose-invert prose-lg max-w-none 
            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
            prose-headings:text-white
            prose-strong:text-white
            prose-ul:text-slate-300
            prose-li:text-slate-300
          ">
            {chapter.content}
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={!hasPrev}
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden md:inline">Previous</span>
          </Button>

          <div className="flex-1 mx-4">
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentGlobalIndex + 1) / totalChapters) * 100}%` }}
              />
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={goNext}
            disabled={!hasNext}
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
