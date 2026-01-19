import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, ChevronLeft, ChevronRight, Menu, X, Home, 
  BookMarked, ScrollText, FileText, ExternalLink, Volume2, VolumeX, Pause, Play, Download, ArrowLeft
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
        <p>This book will be called "conspiracy theory." That term was created by the CIA in 1967 specifically to discredit people who ask questions. You'll find the declassified document referenced in Chapter 10 and sourced in the appendix. That's not opinion. That's documented history.</p>
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
        <p>You have free will. You have discernment. It is up to you to seek your own truth.</p>
        <p>What follows is our version - a guide, an outline, examples drawn from years of study and personal revelation. We present it not as doctrine but as a starting point for your own journey.</p>
        <p>People are conditioned not to pay attention. Not to care. Not to question. That conditioning serves the system, not the Creator. We believe the Father is separating His flock - those with ears to hear and eyes to see - from those who choose to remain asleep. This book is for those who are waking up.</p>
        <p className="text-cyan-400 mt-4">Take what resonates. Question what doesn't. Verify everything you can. And above all - seek the Creator directly. No book, no teacher, no institution can replace that relationship.</p>
      </>
    )
  },
  {
    id: "v1-authors-note",
    title: "Author's Note",
    content: (
      <>
        <p>For years, regret and self-loathing were constant companions. Alcohol became a way to cope - a way to numb something that couldn't be named. It nearly won.</p>
        <p>But the Father, through the Son, intervened. Sobriety brought clarity. Clarity brought revelation. And revelation demanded to be shared.</p>
        <p>What you hold in your hands (or on your screen) is the product of that clarity. Years of research. Countless hours down rabbit holes that led somewhere - and some that led nowhere. The painful process of unlearning what was taught and relearning what was hidden.</p>
        <p>This book is written in the voice of a documentary narrator - authoritative but conversational. It's designed to be read or listened to aloud. If you're hearing this as an audiobook, know that every word was chosen with your ears in mind.</p>
        <p>I don't claim to have all the answers. I claim to have found patterns that deserve attention. Questions that deserve asking. Connections that the system works very hard to keep hidden.</p>
        <p>Read critically. Verify independently. Trust your discernment - especially once you start restoring the receiver that was designed to perceive truth.</p>
        <p className="text-cyan-400 mt-4">The journey through the veil begins now.</p>
        <p className="text-right italic text-slate-400 mt-6">Jason Andrews<br/>January 2026</p>
      </>
    )
  },
  {
    id: "v1-cepher-intro",
    title: "About the Cepher Translation",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">THE CEPHER PREFACE</p>
        <p>This collection of writings in the את Cepher (pronounced sef'-er) is a restoration of the books traditionally recognized as set-apart Scripture. It includes certain writings retained in the Dead Sea Scrolls (Chanoch and Yovheliym), together with the recaptured writings of the Cepher Ha'Yashar (Yashar) and the Apocalypse of Baruch (2 Baruch), the recapture of books from the Septuagint, and the last two writings of the Makkabiym (3 and 4 Maccabees).</p>
        <p>Contrary to the ineffable name doctrine created and sustained by rabbinical influences, the את Cepher sets forth the set-apart name and set-apart identities in an English transliteration. It restores the names of people and places found in the original Ivriyt (Hebrew) tongue, all of which have also been transliterated into English.</p>
        <p>The instructions in scripture itself are directly contrary to this doctrine, including the practice of Mashiach himself who declared the name openly:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="italic">"Give ear, O you heavens, and I will speak; and hear, O earth, the words of my mouth. My doctrine shall drop as the rain, my speech shall distil as the dew, as the small rain upon the tender herb, and as the showers upon the grass: Because <strong>I will publish the name of Yahuah</strong>: ascribe you greatness unto our Elohiym."</p>
          <p className="text-cyan-300 font-medium mt-2">Devariym (Deuteronomy) 32:1-3</p>
        </div>
      </>
    )
  },
  {
    id: "v1-cepher-yahuah",
    title: "The Name of Yahuah",
    content: (
      <>
        <p>We set forth the name Yahuah (יהוה). This name has gone unmentioned for over two millennia based upon the ineffable name doctrine articulated after the destruction of the second temple. However, Yocephus tells us in Wars of the Jews that the name was pronounced by the priests prior to the temple's destruction, and they pronounced it as four vowels.</p>
        <p>We believe that the demands of the language declare those vowels to be:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p className="text-xl text-center"><strong>ee</strong> (yod) <strong>ah</strong> (heh) <strong>oo</strong> (vav) <strong>ah</strong> (heh) = <strong className="text-cyan-400">Yahuah</strong></p>
        </div>
        <p>This name stands alone as Yah 45 times in the Tanakh: Shemoth 15:2; Yesha'yahu 12:2; 26:4; 38:11; Tehilliym 68:4; 68:18; 77:11; 89:8; 94:7; 94:12; 102:18; 104:35; 105:45; 106:1; 106:48; 111:1; 112:1; 113:1; 113:9; 115:17; 115:18; 116:19; 117:2; 118:5; 118:14; 118:17; 118:18; 118:19; 122:4; 130:3; 135:1; 135:3; 135:4; 135:21; 146:1; 146:10; 147:1; 147:20; 148:1; 148:14; 149:1; 149:9; 150:1; 150:6.</p>
        <p>Even the King James Bible recognizes this name, writing in Psalm 68:4: "Sing unto God, sing praises to His Name: extoll him that rideth upon the heavens, <strong>by his Name Iah</strong>, and rejoice before him."</p>
      </>
    )
  },
  {
    id: "v1-cepher-yahusha",
    title: "The Name of Yahusha",
    content: (
      <>
        <p>We have set forth the name of the Messiah as Yahusha (יהושע), partly because this name is identical to the name as was set forth in Bemidbar (Numbers) describing Ephrayimiy Husha, the son of Nun, who was selected as one of the twelve to spy out the Promised Land during the beginning of the Exodus:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="italic">"Of the tribe of Ephrayim, Husha the son of Nun."</p>
          <p className="text-cyan-300 font-medium">Bemidbar (Numbers) 13:8</p>
          <p className="italic mt-2">"These are the names of the men which Mosheh sent to spy out the land. And Mosheh called Husha the son of Nun <strong>Yahusha</strong>."</p>
          <p className="text-cyan-300 font-medium">Bemidbar (Numbers) 13:16</p>
        </div>
        <p>The name Yahusha is found 175 times in the Tanakh, and it has a wonderful meaning as the name is constructed from two words: Yahuah (יהוה) and yasha (ישע). The word yasha is a primitive root meaning properly: to be open, wide or free, that is, by implication to be safe; causatively to free or succor: to avenge, defend, deliver, help, preserve, rescue, to be safe, to bring or to have salvation, to save, or to be a Savior, or to get victory.</p>
        <p>Most persuasively, we found the Septuagint's translation of the name of Joshua to be conclusive that the Mashiach had the same name as both are called Iesous (Ἰησοῦς) in the Greek. The Messiah has the same name as Joshua, son of Nun.</p>
      </>
    )
  },
  {
    id: "v1-cepher-ruach",
    title: "Ruach Ha'Qodesh",
    content: (
      <>
        <p>The translation of the two languages from which scripture is derived - namely Greek (Yavaniy) and Hebrew (Ivriyt) - have been used to render both the phrase Holy Spirit and Holy Ghost. We have elected to use <strong>Ruach</strong> where it appears in the text for the Ivriyt and πνεῦμα (pneuma) for the Greek, as they have identical meaning.</p>
        <p>Strong's tells us that (רוּחַ) rû-ach H7306 is a primitive root meaning properly, to blow, i.e. breathe; by resemblance breath, i.e. a sensible (or even violent) exhalation. Similarly, Strong's tells us that πνεῦμα (pneuma) G4151 means a current of air, i.e. breath (blast) or a breeze.</p>
        <p>Rather than distort the meaning using terms which may show pagan beginnings personifying the breath as a ghost or spirit, we use Ruach where it appears in the text both for the Ivriyt and for the Greek, and use the term <strong>Qodesh</strong> for the Greek ἅγιος (hagios), as they have identical meaning. The Ruach is identified by conspicuous characteristics in the text:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p className="italic">"With him dwells the <strong>Ruach Da'ath v'Chokmah</strong> [Breath of knowledge and wisdom] the <strong>Ruach Ha'Torah</strong> [Breath of Instruction] and <strong>Gevurah</strong> [Breath of Power] and the ruach of those who sleep in righteousness; he shall judge secret things."</p>
          <p className="text-cyan-300 font-medium mt-2">Chanoch (Enoch) 49:1-4</p>
        </div>
      </>
    )
  },
  {
    id: "v1-cepher-removed",
    title: "The Removed Books",
    content: (
      <>
        <p>You will find references to books that you may not recognize if you are an adherent to the post-19th Century Protestant Bible and its sixty-six books. These citations include books such as the Cepher Yovheliym (Jubilees), the Cepher Chanoch (Enoch), the Cepher ha'Yashar (Jasher), the Cepheriym Baruch, the Cepheriym Esdras (Ezra), or the Cepheriym Makkabiym (Maccabees).</p>
        <p>The Apocrypha has been included as part of the Bible since the text was initially assembled in the late 4th Century by Eusibeus. It was canonized at the Council of Trent and included in the 1539 Great Bible of Myles Coverdale, the 1560 Geneva Bible of John Calvin, and the 1611 King James Bible.</p>
        <p>The sixty-six-book reduction was the result of the Westminster Confession, where Parliament reversed itself as to the Protestant Canon to give favor to Scottish Presbyterians who agitated for the same. The reduction of the text of scripture was exclusively an Anglican political act, not a theological conclusion consistent with the development of scripture.</p>
        <p>It is believed that in the 2nd Century BC, 70 Rabbis translated 54 books from Ivriyt to Greek, a translation called the Septuagint. The Septuagint did not include the Cepher Chanoch (Enoch) and the Cepher Yovheliym (Jubilees), but did contain all of the Apocrypha.</p>
      </>
    )
  },
  {
    id: "v1-cepher-enoch",
    title: "The Book of Chanoch (Enoch)",
    content: (
      <>
        <p>We have elected to include the Cepher of the Prophet Chanoch (also known as 1 Enoch). While some historians have rejected Chanoch as heresy, Kepha Sheniy (2 Peter) 2:4-5 indicates that one of the believers in Chanoch was Kepha himself, for he states: "For if Elohiym spared not the angels that sinned, but cast them down to She'ol, and delivered them into chains of darkness, to be watched unto the judgment of anguish; And spared not the old world, but saved Noach the eighth person, a preacher of righteousness, bringing in the flood upon the world of the wicked..."</p>
        <p>While the Ethiopian Bible - the earliest complete collection in the world - has always contained both Chanoch and Yovheliym, the decision to include both of these books was made easier when ancient versions of Chanoch and Yovheliym were found in Cave 4 at Qumran (Dead Sea Scrolls).</p>
        <p>The Cepher of the Prophet Chanoch was known to the crafters of the Brit Chadasha (New Testament) as the following quote from Chanoch 2:1 in the Cepher Yahudah (Book of Jude) indicates:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="italic">"And Chanoch also, the seventh generation from A'dam, prophesied of these, saying: 'Behold, <strong>Yahuah</strong> comes with ten thousands of his qodeshiym, to execute judgment upon all, and to convince all that are wicked among them of all their wicked deeds which they have wickedly committed...'"</p>
          <p className="text-cyan-300 font-medium mt-2">Yahudah (Jude) 14-15</p>
        </div>
      </>
    )
  },
  {
    id: "v1-cepher-jasher",
    title: "Yovheliym and Yashar",
    content: (
      <>
        <p><strong>Yovheliym (Jubilees)</strong> - also known as "The Little Genesis" - is an ancient text believed to have been initially set forth in the Ivriyt (Hebrew) language and is attributable to Mosheh as the author. The Cepher Yovheliym presents "the history of the division of the days of the Torah, of the events of the years, the year-weeks, and the jubilees of the world" as secretly revealed to Mosheh by Yahuah while Mosheh was on Mount Ciynai for forty days and forty nights. Between 1947 and 1956, approximately 15 Yovheliym scrolls were found in five caves at Qumran.</p>
        <p><strong>Yashar (Jasher)</strong> is also set forth in this את Cepher. The traditions of construction in the world of the Ivriym was by oral tradition (all scholars readily admitting that the "oral law" was transmitted this way between the generations for centuries). One of those scholars who acknowledged the ancient origin of the cepher, according to M. M. Noah, was Yocephus, who had written in respect of the Cepher Yashar that "by this book are to be understood certain records kept in some safe place on purpose, giving an account of what happened among the Ivriym from year to year, and called 'Jasher' or 'The Upright'..."</p>
        <p>These are the two places where Yashar is quoted in the Old Testament:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p className="italic">"And the sun stood still, and the moon stayed, until the people had avenged themselves upon their enemies. Is not this written in the Cepher of Yashar?"</p>
          <p className="text-cyan-300 font-medium">Yahusha (Joshua) 10:13</p>
        </div>
      </>
    )
  },
  {
    id: "v1-cepher-666",
    title: "Chi Xi Stigma",
    content: (
      <>
        <p>One of the most interesting corrections in this text is found in Chazon (Revelation) 13:18, which restores the original Greek letters to what has been interpreted for the last 400 years as six hundred threescore and six:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="italic">"Here is wisdom. Let him that hath understanding count the number of the beast: for it is the number of a man; and his number is Six hundred threescore and six."</p>
          <p className="text-cyan-300 font-medium">Revelation 13:18 KJV</p>
        </div>
        <p>However, there are no numbers, but rather the three Greek letters χξς (chi xi stigma). These letters found in Strong's Greek Dictionary 5516 are defined as the 22nd, 14th and an obsolete letter (4742 as a cross) of the Greek alphabet, used as numbers: six hundred, 60 and 6.</p>
        <p><strong>Stigma</strong> (στιγμα stig'ma) from Strong's Greek Dictionary 4742, is a word from a primary stizo (to "stick") meaning a mark incised or punched (for recognition of ownership), i.e. figuratively a scar of service: or mark. For example, a <em>stigmata</em> or in another instance, to stigmatize.</p>
        <p className="text-cyan-400 mt-4">We elected to restore the actual picture of the mark as it was seen by Yochanon (John): <strong>χξς</strong> - the chi xi stigma.</p>
      </>
    )
  },
  {
    id: "v1-cepher-aleph-tav",
    title: "The Aleph Tav (את)",
    content: (
      <>
        <p>One Ivriyt word which has escaped translation in all English texts is the word "eth" (את), which is spelled in the Ivriyt as <strong>Aleph Tav</strong>. The Aleph א is understood as a representation of the ox head, the symbol of strength and is often construed as a crown of leadership. The Tav ת (an ex or cross) means the mark, or sign, or covenant. It is our election to include all of the stand-alone Aleph Tavs that show up in the text in the Tanakh, and the times the Aleph Tav shows up in the Brit Chadashah without benefit of direct translation.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p className="italic">"In the beginning Elohiym created <strong>את</strong> the heavens and <strong>את</strong> the earth."</p>
          <p className="text-cyan-300 font-medium">Bere'shiyth (Genesis) 1:1</p>
          <p className="italic mt-4">"In the beginning was the Word, and the Word was with <strong>את</strong> Elohiym, and Elohiym was the Word."</p>
          <p className="text-cyan-300 font-medium">Yochanon (John) 1:1</p>
          <p className="italic mt-4">"I am the א (Aleph) and the ת (Tav), the beginning and the ending, says Yahuah Elohiym, which is, and which was, and which is to come, Yahuah Tseva'oth."</p>
          <p className="text-cyan-300 font-medium">Chazon (Revelation) 1:8</p>
        </div>
        <p className="text-cyan-400 mt-4">It is our most fervent prayer that these corrections in the את Cepher are found true and pleasing to <strong>Yahuah Elohaynu</strong> (Yahuah our Elohiym), and that they would come to bless you in your pursuit of the Truth to which you were called.</p>
        <div className="bg-slate-800/30 p-4 rounded-lg mt-6 text-center italic">
          <p>"Who has ascended up into heaven, or descended? Who has gathered the wind in his fists? Who has bound the waters in a garment? Who has established all the ends of the earth? What is His name, and what is His Son's name, if you can tell?"</p>
          <p className="text-cyan-300 font-medium mt-2">Mishlei (Proverbs) 30:4</p>
        </div>
      </>
    )
  },
  {
    id: "v1-cepher-yasharal",
    title: "Yashar'el",
    content: (
      <>
        <p>The name we know as "Israel" (ישראל) is properly understood as <strong>Yashar'el</strong> - a combination of two words:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p><strong>Yashar</strong> (ישר) = straight, upright, righteous, just</p>
          <p><strong>El</strong> (אל) = Mighty One</p>
          <p className="mt-2"><strong>Yashar'el</strong> = "Straight to the Mighty One" / "Upright with the Almighty"</p>
        </div>
        <p>Consider Jacob's original name - Ya'akov (יעקב) - which comes from "akov" (עקב) meaning <strong>"crooked"</strong> or "heel-grabber." After wrestling with the messenger at Jabbok, he becomes Yashar'el - transformed from crooked to upright. This is a <em>spiritual transformation</em>, not a geographic designation.</p>
        <p className="text-cyan-400 mt-4">Scripture also uses <strong>Yeshurun</strong> (ישרון) - "the upright one" - as a poetic name for the true people of the covenant in Devariym (Deuteronomy) and Yesha'yahu (Isaiah).</p>
      </>
    )
  },
  {
    id: "v1-authors-insights",
    title: "Connecting the Dots",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">THE AUTHOR'S UNDERSTANDING</p>
        <p className="italic text-slate-400 mb-4">The preceding Cepher preface represents a condensed version of the translators' work - the names, the letters, the excluded books. What follows are my own insights - connections I drew when looking at what they provided. The Cepher gave the correct language. These are my dots connecting.</p>
        <p className="italic text-slate-400 mb-4">I do not claim these as doctrine. I claim them as the picture that emerged when the dots finally connected. Verify everything. Question what doesn't resonate. But consider the possibility that what's presented here might explain things that never quite made sense before.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Gematria Connection</p>
        <p>The Cepher showed that Revelation 13:18 contains Greek letters - χξς (chi xi stigma) - not the number 666. That's their work. Here's what I found when I looked deeper, and this is where it gets undeniable.</p>
        <p>Greek isopsephy (gematria) assigns numerical values to letters. The ancients used this extensively - it wasn't mysticism, it was mathematics embedded in language. When we calculate the Greek name and title that billions call upon:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p><strong>Ἰησοῦς (Iesous/Jesus)</strong> = 888</p>
          <p><strong>Χριστός (Christos/Christ)</strong> = 1480</p>
          <p><strong>Ἰησοῦς Χριστός (Jesus Christ)</strong> = 888 + 1480 = <strong>2368</strong></p>
        </div>
        <p>Now here is where the dots connect in a way that cannot be dismissed as coincidence. The complete Greek phrase from Revelation 13:18 - <strong>"καὶ ὁ ἀριθμὸς αὐτοῦ χξϛ"</strong> (and his number is chi xi stigma) - when calculated using the same exact method, <em>also equals 2368</em>. The exact same gematria value as "Jesus Christ."</p>
        <p>Stop and consider what this means. The passage that identifies the beast's number - the very phrase itself - carries the same numerical signature as the name billions worship. This isn't interpretation. It's mathematics. Anyone can verify it. And yet most have never heard this connection.</p>
        <p>Now consider this alongside what Yahusha said in Yochanon (John) 5:43: "I am come in my Father's name, and you receive me not: if another shall come in his own name, him you will receive."</p>
        <p><strong>Yahusha</strong> (יהושע) literally contains <strong>Yahuah</strong> (יהוה) - look at the letters. The Father's name is embedded within the Son's name. Yod-He-Vav-He becomes Yod-He-Vav-Shin-Ayin. He came IN the Father's name. The name itself carries the Father.</p>
        <p>But "Jesus" is a Romanized Greek translation that passed through Latin before reaching English. There is no connection to Yahuah whatsoever. The Father's name has been completely removed. And billions call upon this name without ever knowing the original - or that removing the Father's name might carry consequences.</p>
        <p>This isn't about condemning anyone. It's about asking: if names matter - if they carry meaning, authority, and allegiance - then what does it mean that the whole world calls upon a name stripped of the Father while the original remains hidden?</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Spiritual Mark</p>
        <p>While many focus on a physical manifestation - a chip, a tattoo, a barcode - consider the deeper meaning of the forehead and hand. Scripture uses this same language in Devariym (Deuteronomy) 6:8 regarding the Torah: "And thou shalt bind them for a sign upon thine hand, and they shall be as frontlets between thine eyes."</p>
        <p>The <strong>forehead</strong> represents the mind - what you believe, who you acknowledge as authority, where your signal comes in. The <strong>hand</strong> represents your works - what you labor for, what you build, whom you serve with your actions. The mark of Yahuah or the mark of the beast is first and foremost a matter of <strong>allegiance</strong>.</p>
        <p>If a physical mark is required to "buy or sell," it may simply be the outward confirmation of a spiritual decision already made. You will not be forced. You will choose. And that choice may have already been made through acceptance of false doctrine in the mind (forehead) and participation in false worship with the body (hand).</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Symbolism Everywhere</p>
        <p>The chi xi stigma imagery appears constantly in modern branding, architecture, hand signs, and corporate logos - often disguised but recognizable once you know what to look for.</p>
        <p>Consider the Monster Energy drink logo - three claw marks that form the Hebrew letter "vav" (ו) repeated three times. Vav has a numerical value of 6. Three vavs: 666. Hidden in plain sight on millions of cans.</p>
        <p>Observe the hand sign made by countless celebrities - thumb and index finger forming a circle with three fingers extended. It creates 666. Some dismiss this as coincidence or the "OK" sign. But when the same gesture appears across industries, nationalities, and decades, coincidence strains credulity.</p>
        <p>Corporate emblems from technology giants display circular patterns that, upon inspection, contain interlocking sixes. These are the companies that seemingly control everything - information, communication, commerce. Why would they encode this symbolism unless it meant something?</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Deceived Initiates</p>
        <p>Perhaps many who display these symbols have themselves been deceived. They may genuinely believe they are part of something chosen - that they have witnessed miracles, that they know who the true messiah is, that the timing simply hasn't been right for his public revelation.</p>
        <p>When people call them "Illuminati" or "out of touch," they can laugh. The Illuminati as a formal organization may no longer exist. But the spirit behind it continues. And if these initiates truly believe they serve the returning messiah - if they have seen things that convinced them - their confidence makes sense. They're not nervous because they believe they're on the winning side.</p>
        <p>Some of these people seem to get younger. Inexplicably. They have access to things the public does not. Perhaps their benefactor waits in the wings, building an army of witnesses who will say: "No, you don't understand. I've seen him. I've seen the miracles. This is the one."</p>
        <p>When that figure finally presents himself - at the right time, with the right narrative - he arrives with an existing network of convinced advocates. The Faustian bargains, the fortune and fame, the symbols hidden in plain sight - all preparation for that moment.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">Stars and Fallen Angels</p>
        <p>Celebrities are called <strong>"stars"</strong> - and fallen angels were cast down from heaven as falling stars (Chizayon 12:4, Yesha'yahu 14:12). Many prominent "stars" bear El names. Some appear to reverse-age inexplicably. They're paid to stupefy, distract, mesmerize - to hypnotize the masses while mocking the true Elohiym simultaneously. It's spiritual and subconscious, but it all matters. The physical realm is merely an encasement for spirit, and every nuance - even the ones we never consciously notice - is where the hooks are set.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">Yashar'el vs. Israel: The Isis-Ra-El Question</p>
        <p>The Cepher explained that Yashar'el means "Upright with the Almighty" - a spiritual transformation, not a geographic designation. Jacob went from crooked (Ya'akov) to upright (Yashar'el). A change in character, not a change in address. Here's what I saw when I looked at the English word "Israel."</p>
        <p><strong>Spiritual Yashar'el</strong> refers to those living in covenant relationship with Yahuah - the scattered remnant with eyes to see and ears to hear. They could be anywhere in the world, from any nation, any background. The upright ones aligned with the Creator.</p>
        <p><strong>The modern nation-state of Israel</strong> (established 1948) is a geopolitical entity, created through political powers - the British Mandate, UN Resolution 181, and significant Rothschild financing. Everyone watches a geographic location for prophetic fulfillment while the true Israel is spiritual and scattered across the earth.</p>
        <p>Now here is where it gets striking. Some have noted that "Israel" as pronounced in English could be heard as a combination of pagan deities: <strong>Isis</strong> (Egyptian goddess) + <strong>Ra</strong> (Egyptian sun god) + <strong>El</strong>. Say it slowly. Is-Ra-El. Three names. Two of them are Egyptian deities the Ivriym were explicitly commanded to reject.</p>
        <p>Consider the implications:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p><strong>Two false deities placed BEFORE El</strong> - directly violating "You shall have no other elohim before me." Isis comes first. Then Ra. Then El. The very structure of the word places false gods before the true.</p>
          <p className="mt-2"><strong>The reading order reversed</strong> - Original Ivriyt (Hebrew) reads right to left; English reads left to right. Even the direction of perception is inverted. What was meant to be read one way is now read backwards.</p>
          <p className="mt-2"><strong>The geopolitical confusion</strong> - People passionately debate this word, take sides, go to war over it - arguing about a word that may encapsulate the entire deception hidden in plain sight</p>
        </div>
        <p>Think about it. The same people who dismiss Scripture as "just allegory" or "ancient myths" will take heated, passionate sides on the modern geopolitical conflict - arguing, protesting, even dying over a word that mocks everything encoded in it. The inspired language reduced to phonetics stripped of meaning. The order reversed. The false deities placed before the true. The geographic confusion covering the spiritual reality. And humanity arguing about it all without ever seeing what's hidden right there in the name itself.</p>
        <p>Coincidence? Or revelation hiding in plain sight?</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Question of "El" Names</p>
        <p>Scholars debate whether "El" (אל) is simply a generic Semitic word for "mighty one" - or whether it originally referred to the supreme deity of the Canaanite pantheon, whose attributes were later absorbed by Yahuah.</p>
        <p>The Dead Sea Scrolls version of Devariym 32:8-9 shows <strong>El Elyon</strong> (the Most High) assigning nations to different elohiym, with <strong>Yahuah</strong> receiving Yashar'el as his portion - implying they may have been understood as distinct beings.</p>
        <p>Consider the prevalence of "El" names in positions of power and prominence: Elon, Denzel, Michael, Daniel, Gabriel, Emmanuel. If "El" carries hidden allegiance to the Canaanite deity, these names become signals - a mockery understood only by initiates.</p>
        <p>Even in fiction, the pattern appears. Superman's Kryptonian name is <strong>Kal-El</strong>. His father is <strong>Jor-El</strong>. The entire house is the House of El. The "S" symbol - often interpreted as the serpent - adorns his chest. A savior figure from the sky, bearing the El name, worshiped by the masses. Coincidence or revelation hiding in entertainment?</p>
        <p>Consider children's programming: The Smurfs featured a villain named <strong>Gargamel</strong> and his cat <strong>Azrael</strong> - the name of the angel of death in certain traditions. Little blue creatures, an evil wizard with gargoyle imagery in his name, and the death angel as his companion. Children absorbed these names every Saturday morning, internalizing them as harmless cartoon characters. By adulthood, the conditioning is complete. Hidden in plain sight, in cartoons, for children.</p>
        <p>Some suggest that the proper pronunciation should be <strong>"AL"</strong> rather than "EL" - a subtle difference in frequency and sound that may carry significant meaning. If names operate on vibrational frequencies, this small distinction could be the difference between alignment with the Creator and unwitting allegiance to the counterfeit.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Reordered Timeline</p>
        <p>What if we've been taught the prophetic timeline in the wrong order? Traditional teaching says: Rapture → Tribulation → Second Coming → 1000 Year Reign → Satan Released → Armageddon → Final Judgment.</p>
        <p>But consider the alternative: What if the true Messiah has already returned? What if the millennial reign has already happened - during what we call the medieval period, when faith spread across the known world and cathedrals rose to heaven? What if history was then erased, reset, and we now find ourselves in Satan's "little season" described in Revelation 20?</p>
        <p>This would mean the timeline is: True Messiah returned → 1000 Year Reign occurred → Reset/Erasure → <em>We are NOW in Satan's little season</em> → False messiah appears → Mark willingly accepted → Script flips → Tribulation → Final Judgment.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Mortal Wound Healed</p>
        <p>Chizayon (Revelation) 13:3 describes a beast with a mortal wound that was healed, causing the whole earth to marvel and follow. For centuries, interpreters have looked for a future event - a person who dies and returns, or an empire that collapses and revives. They're watching. Waiting. Looking forward.</p>
        <p>But within the framework of the reordered timeline, consider this interpretation that fits like a key in a lock:</p>
        <p>What if the <strong>mortal wound</strong> was Satan being <strong>bound</strong> during the millennial reign? Scripture describes him being chained, thrown into the bottomless pit, unable to deceive the nations for a thousand years. From an operational standpoint, he was effectively "dead." The system he had built was wounded - unable to function. The beast was mortally wounded.</p>
        <p>And what if the <strong>healing</strong> is his release? The "little season" begins. The chains come off. Deception returns in full force. The beast system reboots. The world marvels and follows without even knowing what they're following - because history has been reset and no one remembers what came before.</p>
        <p>Consider the phrase in Chizayon (Revelation) 17:8: The beast "that was, and is not, and yet is." Parse that carefully. <strong>Was</strong> - it operated before the binding. <strong>Is not</strong> - it was bound, inactive, "dead." <strong>Yet is</strong> - it's operating again now. The grammar itself describes a cycle: active, then inactive, then active again.</p>
        <p>Here is the key insight: Everyone is looking for a <em>future</em> wound and healing. They're waiting for something to happen. They're watching for an assassination and resurrection, or an empire to fall and rise. They don't realize it may have <em>already happened</em> - and the healing is the current state of the world we live in right now.</p>
        <p>And the very fact that no one considers this possibility? That everyone dismisses it without examination? That is itself evidence of the deception working exactly as designed.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Multi-Level Deception</p>
        <p>Consider what everyone is waiting for: The current Jewish people still await the first coming of the Messiah. Christians await a second coming. Secular society awaits alien contact or technological salvation. Everyone is looking for something.</p>
        <p>What if a figure appears? Performs miracles. Brings apparent peace. The world unites. He offers a mark - not as oppression but as blessing. Protection. Membership in the saved. Those who refuse become the rebels, the dangerous ones.</p>
        <p>You will not be forced. You will gladly accept. Because if you've already accepted false doctrine in your mind (forehead) and participated in false worship with your body (hand), the physical mark is simply confirmation of what is already spiritually present.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Third Temple Already Built</p>
        <p>Everyone watches Jerusalem. Waiting for a physical temple to be constructed on the Temple Mount. The political tensions. The religious implications. The prophetic significance.</p>
        <p>But Sha'ul (Paul) wrote clearly in Qorintiym Rishon (1 Corinthians) 6:19: "Know ye not that your body is the temple of the Ruach Ha'Qodesh which is in you?" The Third Temple isn't stone and mortar. It's flesh and spirit. It's already built - in every believer who houses the Set-Apart Spirit.</p>
        <p>The deception is watching for an external building while the real temple - you - is being defiled from within. The abomination of desolation isn't a future event in a future building. It's false doctrine standing where it should not stand, in the temple that already exists: your mind, your heart, your body.</p>
        <p>This is why the mark matters. It's not about a chip or a barcode. It's about what you've accepted in your thinking (forehead) and what you've participated in with your actions (hand). The physical mark - if there is one - is merely the seal on what's already spiritually present.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Complete Inversion</p>
        <p>Yahusha warned in Yochanon (John) 16:2: "They shall put you out of the synagogues: yea, the time comes, that whosoever kills you will think that he does Elohiym service."</p>
        <p>Read that again. Let it sink in. Those who persecute and kill the true believers will think they're serving the Most High. They won't be mustache-twirling villains who know they're evil. They won't wear black hats and cackle. They'll be devout. Sincere. Prayerful. Absolutely convinced they're on the side of righteousness. They will believe with all their hearts that they are doing the will of the Creator when they turn against the remnant.</p>
        <p>This is the complete inversion. The script flips. Those who accepted the false messiah, took the mark willingly, and joined what they believed was the kingdom of light - they become the instruments of judgment against the remnant who refused. And they'll do it with a clear conscience, because they genuinely believe they're serving.</p>
        <p>How can someone be so deceived? Consider: if you've accepted a false doctrine that feels true, worshipped in a way that feels right, used names that feel correct, followed a figure who performs miracles - why would you ever question it? You've seen the signs. You've felt the presence. You're surrounded by millions who believe the same thing. Of course you're on the right side. Of course those who refuse are the dangerous ones. Of course they need to be dealt with.</p>
        <p>Consider also the word "God" itself - which traces back to "Gad," a deity of fortune mentioned in Yesha'yahu (Isaiah) 65:11 in a negative context. The prophet condemns those who "prepare a table for that troop" - the word for "troop" is Gad. Even the name billions use for the Creator may carry hidden allegiance to something else entirely. The inversion goes that deep. We've been calling upon a word that may not point where we think it points.</p>
        <p>Every layer you peel back reveals another. That's the complete inversion. It's so thorough, so comprehensive, that most people will never see it - and will actively fight against anyone who tries to show them.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Hydra</p>
        <p>The beast with seven heads. Cut one off and another appears. Every layer of deception revealed just uncovers another. You think you finally understand, and five more layers emerge. The system is so entrenched, so multi-dimensional, so thoroughly woven into every aspect of life that you'd have to look in five hundred directions simultaneously to keep up.</p>
        <p>That's why this understanding is terrifying. It's not one thing to fix. It's not one lie to expose. It's everything. The names. The calendar. The holidays. The institutions. The entertainment. The news. The education. The religion. All of it working together, each piece reinforcing the others, each layer hiding the next.</p>
        <p>Maybe that's why this understanding is emerging now - not because it wasn't there before, but because the time is approaching when it needs to be known. Maybe it signifies the actual time we are in. The veil lifting for those with eyes to see, even as the deception intensifies for those without.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Correct Language Gave the Correct Picture</p>
        <p>Every single one of these insights emerged from the Cepher's faithful translation of the original language. The names. The definitions. The letters. The restoration of excluded books. The Cepher translators did the work of giving us the correct language - and when the language was corrected, the picture clarified. The dots connected themselves.</p>
        <p>I didn't make these connections through brilliance or special revelation. I simply looked at what they provided and asked: what does this mean? And once I started asking, the answers built upon each other. Each insight led to the next. Each connection revealed another. The information was there the whole time, hidden in Scripture, waiting for eyes that would see.</p>
        <p>Most people don't know any of this. They've never been shown. They've never been given the correct language to even ask the right questions. They accept what they're given without questioning who gave it to them or why. That's not condemnation - we've all been there. It's the recognition that the deception works precisely because people don't focus or think about these things. They're too busy surviving, too distracted by entertainment, too conditioned to trust authority. They just accept.</p>
        <p>But you're reading this now. So you've already taken the step of looking. You've already separated yourself from those who refuse to see. The question is what you do with what you find. And that's between you and the Creator.</p>
        
        <p className="text-cyan-400 mt-4">Once you know, you can't unknow. It doesn't change the facts - it changes you. You're no longer oblivious. You're no longer ignorant. And that clarity, as terrifying as it may be, is exactly what faith is for. Not believing in something you can't see - but <strong>knowing</strong> that the promise made will be kept. Knowing that what has been revealed was revealed for a reason. Knowing that you were meant to see this, now, in this time.</p>
        <p className="text-cyan-400 mt-2">The fear is real. I felt it writing these words. But the promise is also real. And the One who made it does not lie.</p>
        <p className="text-right italic text-slate-400 mt-6">Jason Andrews<br/>January 2026</p>
      </>
    )
  },
  {
    id: "v1-ch1",
    title: "Chapter 1: The Council and The Fall",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART ONE: THE REBELLION</p>
        <p>To understand where we are, we have to go back to where it started. Not human history. Before that. The celestial rebellion that set everything in motion.</p>
        <p>Scripture speaks of principalities and powers. Of rulers of darkness. Of spiritual wickedness in high places. Sha'ul (Paul) wrote in Eph'siym (Ephesians) 6:12: "For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places." These aren't metaphors. They're descriptions of an organized hierarchy that predates humanity itself.</p>
        <p>At the top of this hierarchy sits the adversary - Satan, the dragon, the serpent of old. Chizayon (Revelation) 12:9 identifies him: "And the great dragon was cast out, that old serpent, called the Devil, and Satan, which deceives the whole world." But he doesn't rule alone. He has a council. The fallen ones who joined his rebellion. The entities who have operated through human proxies throughout recorded history.</p>
        <p>The adversary's strategy has always been imitation. Create a counterfeit of everything the Creator established. A false trinity. A false salvation. A false kingdom. Qorintiym Sheniy (2 Corinthians) 11:14 warns: "And no marvel; for Satan himself is transformed into an angel of light."</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="text-cyan-300 font-medium">Tehilliym (Psalm) 82:1</p>
          <p className="italic">"Elohim stands in the congregation of the mighty; he judges among the elohim."</p>
        </div>
        <p>The council of the fallen mirrors the divine council of heaven. Everything is inverted. Everything is substituted. And most people can't tell the difference because they've never been shown the original.</p>
        <p>This is the pattern that runs through everything that follows. Once you see it, you'll recognize it everywhere.</p>
      </>
    )
  },
  {
    id: "v1-ch2",
    title: "Chapter 2: The 200 Watchers Descend",
    content: (
      <>
        <p>The Book of Chanok (Enoch) describes two hundred angels who abandoned their station in heaven. They descended to Mount Hermon. They took human women as wives. They taught forbidden knowledge. They fathered giants.</p>
        <p>This wasn't myth to the early church. Yahudah (Jude) 1:6 references it directly: "And the angels which kept not their first estate, but left their own habitation, he has reserved in everlasting chains under darkness unto the judgment of the great day." Kepha Sheniy (2 Peter) 2:4 confirms: "For if Elohim spared not the angels that sinned, but cast them down to hell, and delivered them into chains of darkness, to be reserved unto judgment." The Dead Sea Scrolls preserve it.</p>
        <p>It was deliberately excluded from the canon. Made apocryphal. Marginalized.</p>
        <p>Why? Perhaps because it explains too much. The bloodlines. The giants. The advanced technology of previous ages. The origins of the ruling families.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p className="font-medium">There are approximately 200 known impact craters on Earth. Officially explained as meteor strikes over millions of years.</p>
          <p className="mt-2">The Book of Enoch describes 200 Watchers.</p>
          <p className="text-cyan-400 mt-2">Coincidence?</p>
        </div>
        <p>The theory suggests a correlation. That the craters might not be random meteor impacts spread over geological ages. That they might represent the landing sites of the fallen ones. Or the impact points of divine judgment upon them.</p>
        <p>If the 200 craters correlate to the 200 fallen, then the geological record isn't what it claims to be. The millions-of-years timeline collapses. The random universe narrative dissolves.</p>
      </>
    )
  },
  {
    id: "v1-ch3",
    title: "Chapter 3: The Forbidden Knowledge",
    content: (
      <>
        <p>What did the Watchers teach?</p>
        <p>According to the Book of Enoch, they revealed secrets that were not meant for humanity at that stage of development. Azazel taught the making of weapons - swords, knives, shields, breastplates. He taught the art of making them and the science of using them. He also taught cosmetics - the beautifying of the face, the ornamentation of the body.</p>
        <p>Other Watchers taught astrology and enchantments. The cutting of roots - herbal knowledge that could heal or harm. Spellcasting. The resolution of enchantments. Weather manipulation. The interpretation of signs.</p>
        <p>This wasn't neutral knowledge transfer. It was corruption. The acceleration of human development past what they were ready for, in directions that served the fallen's agenda.</p>
        <p>Consider: weapons meant warfare became possible at scale. Cosmetics meant vanity and deception became tools. Enchantments meant spiritual manipulation replaced direct connection with the Creator.</p>
        <p>Each piece of forbidden knowledge served the same purpose: to corrupt what was made good, to separate humanity from their Creator, to build a civilization that served the fallen rather than the Most High.</p>
      </>
    )
  },
  {
    id: "v1-ch4",
    title: "Chapter 4: The Nephilim and the Corruption",
    content: (
      <>
        <p>The union of the Watchers and human women produced offspring. Genesis 6:4 names them: "There were giants in the earth in those days; and also after that, when the sons of God came in unto the daughters of men, and they bare children to them, the same became mighty men which were of old, men of renown."</p>
        <p>The Nephilim. Giants. Heroes of old. Men of renown.</p>
        <p>But the Book of Enoch tells the rest of the story. These giants consumed the produce of men until men could no longer sustain them. Then they turned against men and began to devour them. And they began to sin against birds and beasts and reptiles and fish.</p>
        <p>The corruption wasn't just spiritual. It was genetic. The mixing of what shouldn't have been mixed corrupted the bloodlines of humanity. The DNA itself was polluted.</p>
        <p>This is why the Flood was necessary. Not as punishment for moral failure alone, but as a reset of corrupted genetics. Noah was chosen because he was "perfect in his generations" - his bloodline remained uncorrupted.</p>
        <p>The Flood killed the physical bodies of the Nephilim. But what happened to their spirits? According to Enoch, they became the demons - the evil spirits that wander the earth, seeking bodies to inhabit, working the same corruption their fathers began.</p>
      </>
    )
  },
  {
    id: "v1-ch5",
    title: "Chapter 5: The Flood and What It Destroyed",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART TWO: THE FIRST RESET</p>
        <p>The Flood wasn't just judgment. It was a reset. A wiping clean of corruption that had become too deep to fix any other way.</p>
        <p>Every culture on Earth has a flood narrative. Mesopotamia has the Epic of Gilgamesh. Greek mythology has Deucalion. Hindu tradition has Manu. Chinese history has Gun-Yu. Native American tribes have countless variations. The story is too consistent, too widespread, to be coincidence.</p>
        <p>But what did the Flood actually destroy?</p>
        <p>According to scripture, the entire earth was corrupted. The violence was so complete that the Creator grieved making humanity at all. But there's more than violence in the account. There's the corruption of all flesh - genetic corruption, the mixing of what shouldn't have been mixed.</p>
        <p>What technology existed before the Flood? What knowledge was lost? The antediluvian world had the direct teaching of the Watchers - metallurgy, astrology, enchantments, and more. Noah lived 950 years. Methuselah lived 969 years. What could you learn in a millennium?</p>
        <p>The Flood reset more than morality. It reset knowledge. It reset technology. It reset the timeline.</p>
      </>
    )
  },
  {
    id: "v1-ch6",
    title: "Chapter 6: Dragons, Not Dinosaurs",
    content: (
      <>
        <p>Every culture on Earth has dragon legends. European dragons. Chinese dragons. Mesoamerican feathered serpents. African dragons. Australian rainbow serpents. The dragon appears everywhere.</p>
        <p>The official narrative: these are mythological creatures invented by primitive people who found dinosaur bones and imagined what they might have looked like alive.</p>
        <p>But consider the alternative: what if dragons are real? What if humans and these creatures coexisted, and the legends are memories, not inventions?</p>
        <p>The word "dinosaur" wasn't coined until 1841 by Richard Owen. Before that, these creatures had a name that had been used for thousands of years: dragons.</p>
        <p>Cave paintings show humans alongside creatures that look remarkably like what we now call dinosaurs. Ancient pottery depicts similar scenes. The Anasazi people carved what appear to be sauropods into rock walls. Marco Polo's accounts from China describe creatures that sound like dinosaurs.</p>
        <p>What if the rebranding from "dragons" to "dinosaurs" was deliberate? What if calling them prehistoric creatures extinct for 65 million years was a way to erase the memory of human coexistence? What if the timeline we've been given is part of the veil?</p>
      </>
    )
  },
  {
    id: "v1-ch7",
    title: "Chapter 7: The Dog-Headed Beings and Hybrid Remnants",
    content: (
      <>
        <p>Ancient art and literature describe beings that shouldn't exist. Dog-headed men. Bird-headed beings. Creatures that were part human, part animal.</p>
        <p>Egypt's gods were depicted with animal heads on human bodies. Anubis, the jackal. Horus, the falcon. Thoth, the ibis. Sobek, the crocodile. These weren't just artistic conventions. They were memories.</p>
        <p>The Greek historian Herodotus described encountering dog-headed men in Libya. Medieval travelers reported similar beings. Saint Christopher in some traditions was depicted as dog-headed. Marco Polo's accounts mention them.</p>
        <p>What if these weren't legends? What if the genetic experimentation of the Watchers produced more than just giants? What if hybrid creatures - chimeras - once walked the earth alongside humans?</p>
        <p>The corruption of all flesh described before the Flood would necessarily include such experiments. The mixing of what shouldn't be mixed. The violation of the boundaries the Creator established between species.</p>
        <p>Some of these hybrids may have survived the Flood in isolated pockets. Some may be the source of legends that persisted for centuries. Some may explain why certain ancient cultures were so obsessed with preserving purity of bloodlines.</p>
      </>
    )
  },
  {
    id: "v1-ch8",
    title: "Chapter 8: Babel and the Confusion of Tongues",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART THREE: THE SCATTERING</p>
        <p>After the Flood, humanity was unified. One language. One people. And they decided to build a tower.</p>
        <p>Genesis 11:4: "And they said, Go to, let us build us a city and a tower, whose top may reach unto heaven; and let us make us a name, lest we be scattered abroad upon the face of the whole earth."</p>
        <p>The official interpretation: prideful humans tried to build a tall building. God was offended and confused their language.</p>
        <p>But read it again. "Whose top may reach unto heaven." This wasn't about height. It was about access. They were trying to reach the heavenly realm. To breach the boundary between dimensions. To make a name - establish their own authority - rather than submit to the Creator's.</p>
        <p>The tower was likely a portal. A gateway. A technology for accessing the spiritual realm outside of the Creator's established protocol. Nimrod, who led this project, was a "mighty hunter before the LORD" - a phrase that in Hebrew implies opposition rather than service.</p>
        <p>The confusion of tongues wasn't punishment for building a tall structure. It was prevention of unified humanity accessing forbidden dimensional technology under the leadership of one who served the adversary.</p>
      </>
    )
  },
  {
    id: "v1-ch9",
    title: "Chapter 9: The Divine Language Lost",
    content: (
      <>
        <p>Before Babel, there was one language. Scripture is clear on this. But what was that language?</p>
        <p>Hebrew tradition holds that the original language was Hebrew - the language in which the Creator spoke the universe into existence. "Let there be light" - yehi owr - creative words that shaped reality itself.</p>
        <p>This wasn't just communication. It was power. Words that could create. Words that could command. Words that connected directly to the frequency of the Creator.</p>
        <p>When the languages were confused at Babel, something was lost. Not just the ability to communicate with each other, but the ability to communicate with creation itself. The direct connection between word and reality was severed for most of humanity.</p>
        <p>Hebrew remained - preserved through Abraham's line, maintained through the Israelites, protected even through exile and persecution. But even Hebrew has been affected by time and translation.</p>
        <p>The original language - the divine language that spoke reality into existence - is part of what was lost. Restoring it may be part of what's coming back.</p>
      </>
    )
  },
  {
    id: "v1-ch10",
    title: "Chapter 10: Spelling as Spellcasting",
    content: (
      <>
        <p>Why is it called "spelling"?</p>
        <p>We arrange letters to form words. We call this "spelling." But the word itself comes from "spell" - as in to cast a spell. The connection is not coincidental.</p>
        <p>Words have power. Scripture is clear: the Creator spoke the universe into existence. Words shape reality. The tongue has the power of life and death.</p>
        <p>What if the system has weaponized this truth? What if the words we're taught to use, the spellings we're given, the definitions we accept - are all designed to cast spells on the population?</p>
        <p>Consider: "Government" breaks down to "govern" (to control) and "ment" (from the Latin "mentis" - mind). Government is mind control. "Phonics" shares its root with "phoenix" - the symbol of rebirth through fire. "Mortgage" means "death pledge" in Old French.</p>
        <p>The term "conspiracy theorist" was deliberately created by the CIA in 1967 (documented in CIA Dispatch #1035-960) to discredit those who questioned the Warren Commission's findings on the JFK assassination. It's a spell - words arranged to trigger automatic dismissal rather than consideration.</p>
        <p>Language is technology. Spelling is spellcasting. The words you use shape the reality you create.</p>
      </>
    )
  },
  {
    id: "v1-ch11",
    title: "Chapter 11: Bloodlines and the Thrones of Earth",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART FOUR: THE HIDDEN RULERS</p>
        <p>The same bloodlines have controlled power for millennia. Not the same families in the public sense - names change, disappear into corporations and foundations - but trace the genetics and you find consistent lineage.</p>
        <p>This isn't conspiracy theory. It's documented genealogy. Every U.S. president except one (Martin Van Buren) can trace their ancestry back to King John of England. The European royal families are extensively intermarried. The banking dynasties connect through marriages to the nobility. The pattern is consistent.</p>
        <p>Why? What maintains this bloodline obsession across centuries and continents?</p>
        <p>The Nephilim connection provides an answer. If certain bloodlines carry the genetic legacy of the fallen ones - if certain families have maintained that corrupted DNA through careful breeding - then the persistence of these bloodlines in power makes sense.</p>
        <p>They're not just powerful families. They're carriers of something older. Something connected to the rebellion that began before humanity existed.</p>
      </>
    )
  },
  {
    id: "v1-ch12",
    title: "Chapter 12: The Council of the Cast-Out",
    content: (
      <>
        <p>When this book refers to "the system" - understand what that means. Not bureaucracy. Not incompetence. Not random corruption.</p>
        <p>An ancient intelligence. A coordinated adversarial council that has operated continuously across millennia, working through human proxies, institutions, and bloodlines.</p>
        <p>It adapts. It plans across centuries. It remembers what humanity has been made to forget.</p>
        <p>Every substitution, every inversion, every erasure documented in these pages traces back to this single source - the council of the cast-out, still executing the rebellion that began before human history.</p>
        <p>This council has names in various traditions. The principalities and powers. The rulers of darkness. The spiritual wickedness in high places. They operate through secret societies, through bloodline families, through institutional capture.</p>
        <p>They cannot create - only corrupt. They cannot produce light - only counterfeit it. Their entire strategy is imitation and inversion. Take what the Creator made, copy its form, reverse its function, and present the counterfeit as the original.</p>
        <p>Once you understand this pattern, you see it everywhere. And once you see it, you can no longer unsee it.</p>
      </>
    )
  },
  {
    id: "v1-ch13",
    title: "Chapter 13: The Nephilim Bloodlines Continue",
    content: (
      <>
        <p>Genesis 6:4 says something crucial: "There were giants in the earth in those days; and also after that."</p>
        <p>After that. After the Flood. The Nephilim bloodlines continued.</p>
        <p>How? If the Flood destroyed all flesh except Noah's family? Several theories exist. The corruption may have continued through Noah's daughter-in-law (the wife of Ham, whose son Canaan was cursed). Or there may have been a second incursion of Watchers after the Flood - the Book of Enoch describes two hundred, but it doesn't say all two hundred participated in the first descent.</p>
        <p>What's documented in scripture: after the Flood, giants appear again. The Anakim. The Rephaim. Og of Bashan, whose bed was thirteen feet long. Goliath, who stood over nine feet tall. The children of Israel were commanded to utterly destroy these populations - not for their sins alone, but because of what they were.</p>
        <p>The bloodlines were targeted for elimination because they were corrupted. But some survived. Some went underground. Some continued to breed carefully, maintaining what they considered to be superior genetics.</p>
        <p>And their descendants, the theory suggests, still sit on the thrones of the earth.</p>
      </>
    )
  },
  {
    id: "v1-ch14",
    title: "Chapter 14: Tartaria and the Mud Flood",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART FIVE: THE SECOND RESET</p>
        <p>Look at old photographs of major cities - Chicago, San Francisco, Melbourne, St. Petersburg. Notice something strange: the first floors of magnificent buildings are buried. Windows that should be at street level are underground. Doors open to nothing. Elaborate architectural details are below ground level.</p>
        <p>The official explanation varies: settling, poor construction, deliberate burial for various reasons, street level changes for sanitation.</p>
        <p>But the pattern is global. Consistent. Affecting buildings that show no signs of sinking, built by supposed "primitive" cultures with technology we struggle to replicate today.</p>
        <p>The Tartaria hypothesis suggests: a global event deposited feet of mud across entire continents, burying the ground floors of a previous civilization. Then history was rewritten to erase what came before.</p>
        <p>Who built these buildings? The official timeline has pioneers in log cabins constructing massive marble structures with impossible precision. The technology to create such buildings supposedly didn't exist. Yet there they stand.</p>
        <p>What if the magnificent buildings of the 19th century weren't built by that era's inhabitants at all? What if they were inherited from a previous civilization - one that was destroyed and written out of history?</p>
      </>
    )
  },
  {
    id: "v1-ch15",
    title: "Chapter 15: The Petrified Giants",
    content: (
      <>
        <p>Mountains that look like faces. Rock formations that resemble hands, feet, bodies. The "natural" world contains shapes that seem too precise to be random.</p>
        <p>What if some of these formations are exactly what they appear to be - petrified giants?</p>
        <p>The Nephilim were massive. Some accounts describe beings hundreds of feet tall. When the Flood came, or when subsequent cataclysms struck, what happened to their bodies? Did they simply decompose, or were some preserved through rapid mineralization?</p>
        <p>Mount Everest's name in Tibetan is "Chomolungma" - Mother Goddess of the Universe. Local legends describe it as a deity in repose. Devils Tower in Wyoming was called "Bear Lodge" by Native Americans, with legends describing a giant bear clawing at it. What if these aren't metaphors but memories?</p>
        <p>Silicon-based petrification is documented. Trees become stone. Organic matter mineralizes. Why not giants?</p>
        <p>This remains speculative, but the shapes are there. The legends are consistent. And the pattern of hiding giant history is documented - the Smithsonian alone has been accused of destroying thousands of giant skeleton discoveries over decades.</p>
      </>
    )
  },
  {
    id: "v1-ch16",
    title: "Chapter 16: The Orphan Trains and Memory Erasure",
    content: (
      <>
        <p>Between 1854 and 1929, approximately 250,000 children were transported from East Coast cities to the Midwest and beyond. This was called the "Orphan Train Movement."</p>
        <p>The official story: these were homeless orphans from overcrowded cities being given new opportunities with rural families who needed labor.</p>
        <p>The questions multiply: Why so many orphans at the same time? Why were their records so often destroyed or falsified? Why do so many of these "orphans" have no memory of parents dying, only of being separated from families they clearly remember? Why did they arrive without documentation, without knowledge of their own origins?</p>
        <p>These children were called "Cabbage Patch Kids" - picked up and delivered as if from nowhere, no history, no paperwork, no past. Just children appearing by the thousands with no explanation of where they came from.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p>In the 1980s, a line of dolls became wildly popular. They were called Cabbage Patch Kids. Each doll came with "adoption papers." The premise was that these children came from a cabbage patch - appearing mysteriously with no parents, ready to be adopted.</p>
          <p className="text-cyan-400 mt-2">This wasn't creative marketing. It was mockery - hiding truth in plain sight. The name came directly from what the orphan train children were called: Cabbage Patch Kids, children who appeared from nowhere with no documentation, no history, no parents to claim them.</p>
        </div>
        <p>What if these weren't orphans at all, but children of a previous civilization whose parents were eliminated and whose histories were erased? What if the Orphan Trains were part of a massive reset - a repopulation program designed to place children with no memory of the old world into families who would raise them in the new narrative?</p>
        <p>The timing aligns with the mud flood evidence. The late 1800s - the same period when the magnificent "inherited" buildings appear in photographs, already old, already buried to their first floors. A reset. A memory wipe. A new beginning built on the erased foundation of what came before.</p>
      </>
    )
  },
  {
    id: "v1-ch17",
    title: "Chapter 17: The 200 Craters and the 200 Fallen",
    content: (
      <>
        <p>Return to the numbers. Two hundred Watchers descended on Mount Hermon. Approximately two hundred impact craters exist on Earth.</p>
        <p>Officially, these craters are meteor impacts distributed randomly over billions of years. But look closer. Many of these craters are remarkably similar in size. Their distribution seems patterned rather than random. And the dating of them relies on assumptions about geological timelines that may themselves be fabricated.</p>
        <p>What if these aren't random meteor strikes? What if they're the landing sites of the fallen ones? Or the impact points of divine judgment upon their dwelling places?</p>
        <p>The Book of Enoch describes the Watchers being bound and cast into darkness to await judgment. Their places of power would have been destroyed. The locations of their descent and their strongholds would bear the marks of that destruction.</p>
        <p>Two hundred fallen. Two hundred craters. The correlation demands consideration. If true, it rewrites not just theology but geology. The entire timeline we've been given - the billions of years, the gradual processes, the random universe - collapses into something far more recent, far more purposeful, far more connected to the spiritual war that continues to this day.</p>
      </>
    )
  },
  {
    id: "v1-ch18",
    title: "Chapter 18: The Name That Was Erased",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART SIX: THE GREAT SUBSTITUTION</p>
        <p>The Father's name - Yahuah (יהוה) - appears over 6,800 times in the original Hebrew scriptures.</p>
        <p>It was systematically replaced with "LORD" and "GOD" - titles that could apply to anyone or anything. The most sacred name in existence, given directly to Moses at the burning bush, erased and replaced with generic terms.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="text-cyan-300 font-medium">Shemoth (Exodus) 3:15</p>
          <p className="italic">"And Elohiym said moreover unto Mosheh, Thus shall you say unto the children of Yashar'el, Yahuah Elohiym of your fathers, the Elohiym of Avraham, the Elohiym of Yitschaq, and the Elohiym of Ya'aqov, has sent me unto you: this is my name forever, and this is my memorial unto all generations."</p>
        </div>
        <p>His name forever. His memorial to all generations. Erased 6,800 times and replaced with titles.</p>
        <p>This wasn't accidental. This was systematic. And it happened across every major translation, in every language, for centuries. The rabbinical doctrine of the "ineffable name" claimed it was too holy to pronounce. But scripture commands us to call upon His name. Joel 2:32: "And it shall come to pass, that whosoever shall call on the name of Yahuah shall be delivered."</p>
        <p>How can you call upon a name you've never been told? The erasure wasn't reverence - it was sabotage.</p>
      </>
    )
  },
  {
    id: "v1-ch19",
    title: "Chapter 19: The Dual Crucifixion",
    content: (
      <>
        <p>There were two men on that day named Bar-Abbas - Son of the Father.</p>
        <p>One was Yahusha, the true Son of the Father, who came to redeem humanity through sacrifice.</p>
        <p>The other was a robber, a murderer, a rebel against Rome - also called "Jesus Barabbas" in some manuscripts. Son of the Father. The same title applied to both.</p>
        <p>Pilate presented the choice to the crowd: which Bar-Abbas do you want released? The crowd chose the murderer. The Messiah went to the cross.</p>
        <p>This wasn't just a miscarriage of justice. It was a pattern. The counterfeit released. The true one sacrificed. The substitution encoded into the very act of redemption.</p>
        <p>The adversary's strategy: always offer a counterfeit. Always present a false Bar-Abbas alongside the true one. Let the crowd choose, knowing that the deceived will choose wrong. And when they do, use their choice as leverage against them.</p>
        <p>This same pattern continues today. The false "Jesus" offered by institutional religion - powerless, permissive, separated from the Father's law - versus the true Yahusha who said "if you love me, keep my commandments." The crowd still chooses. The pattern persists.</p>
      </>
    )
  },
  {
    id: "v1-ch20",
    title: "Chapter 20: The King James Corruption",
    content: (
      <>
        <p>The King James Bible is considered the gold standard of English scripture by many believers. It's eloquent, influential, and foundational to English-speaking Christianity.</p>
        <p>It's also compromised.</p>
        <p>King James I of England commissioned this translation to resolve church divisions and consolidate power. The translators worked under specific instructions - instructions that shaped the result in favor of existing church structures and state authority.</p>
        <p>The name of the Father: removed 6,800 times, replaced with LORD. The name of the Son: transliterated through Greek and Latin into a name that didn't exist in Hebrew. The commandments: translated in ways that supported the Church of England's positions.</p>
        <p>Books were removed. The Apocrypha, included in the original 1611 printing, was later stripped out. The Book of Enoch, quoted by Jude and referenced throughout the New Testament, was excluded entirely.</p>
        <p>The King James Bible isn't false. But it's filtered. Shaped. Adjusted to serve institutional purposes. Reading it without understanding this context leaves you with a veil over the veil.</p>
      </>
    )
  },
  {
    id: "v1-ch21",
    title: "Chapter 21: Religious Inversions - The Cross and Hell",
    content: (
      <>
        <p>The cross is the universal symbol of Christianity. Churches are shaped like crosses. Believers wear cross jewelry. The cross appears everywhere.</p>
        <p>But the Messiah wasn't crucified on a cross. The Greek word "stauros" means stake or pole. The cross shape - the T or + - was adopted later, borrowed from pagan symbolism. The Tau cross was sacred to Tammuz. The Egyptian ankh was a cross with a loop. The symbol predates Christianity.</p>
        <p>Did the Messiah die? Absolutely. Was it on a cross-shaped instrument? The evidence suggests a simple stake or pole. The image we venerate may be another substitution.</p>
        <p>Then there's Hell. The word appears in most English translations, but it translates three different Hebrew and Greek concepts: Sheol (the grave, the place of the dead), Hades (the Greek underworld), and Gehenna (a physical valley outside Jerusalem where trash was burned).</p>
        <p>The eternal conscious torment doctrine - burning forever in fire - comes more from Dante's Inferno and medieval imagination than from scripture. The Hebrew understanding was simpler: the wicked are destroyed. "The wages of sin is death" - not eternal torture.</p>
        <p>The terror of Hell has been used to control believers for centuries. What if the tool of control was also an inversion?</p>
      </>
    )
  },
  {
    id: "v1-ch22",
    title: "Chapter 22: The Substituted Calendar",
    content: (
      <>
        <p>The calendar we use is called the Gregorian calendar, after Pope Gregory XIII who instituted it in 1582. It replaced the Julian calendar of Julius Caesar.</p>
        <p>But the Creator established His own calendar. It begins with the new moon. The months align with lunar cycles. The Sabbath is the seventh day. The feasts - Passover, Pentecost, Tabernacles - are set by this calendar.</p>
        <p>The Gregorian calendar moved the Sabbath from Saturday to Sunday. It established Christmas on December 25th - the birthday of various pagan sun gods, far from any probable date of the Messiah's birth. It created Easter based on pagan fertility goddess celebrations.</p>
        <p>Why does this matter? Because the feasts of Yahuah are prophetic. Each one points to events in the plan of redemption. The Messiah was crucified on Passover. The Spirit was given on Pentecost. The return will likely align with Tabernacles.</p>
        <p>By substituting a pagan calendar with pagan holidays, the connection between prophecy and fulfillment was obscured. Believers celebrate traditions that have nothing to do with the Creator's appointed times - and miss the significance of the times He actually established.</p>
      </>
    )
  },
  {
    id: "v1-ch23",
    title: "Chapter 23: Modern Medicine - The Band-Aid Economy",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART SEVEN: THE SYSTEMS OF CONTROL</p>
        <p>Modern medicine was designed to heal. It has been inverted into a system of management.</p>
        <p>The Rockefeller Foundation took control of American medical education in the early 20th century. Through the Flexner Report of 1910, they systematically eliminated medical schools that taught natural and holistic approaches. What remained were institutions focused on pharmaceutical intervention.</p>
        <p>The result: a system that manages symptoms rather than cures causes. Chronic conditions that require lifelong medication. Treatments that create side effects requiring additional treatments.</p>
        <p>This isn't a conspiracy theory - it's documented history. The pharmaceutical industry is among the most profitable on Earth. Their profit model depends on ongoing treatment, not cure.</p>
        <p>Meanwhile, the substances that could decalcify the pineal gland, restore spiritual perception, and heal the body naturally are either illegal or dismissed as "alternative medicine." The inversion is complete: the healing has become the harm, and the harm is called healthcare.</p>
      </>
    )
  },
  {
    id: "v1-ch24",
    title: "Chapter 24: The Indoctrination Machine",
    content: (
      <>
        <p>The modern education system was designed by industrial-age planners who wanted workers, not thinkers.</p>
        <p>John D. Rockefeller's General Education Board, founded in 1902, explicitly stated: "In our dreams, people yield themselves with perfect docility to our molding hands." The goal was never enlightenment - it was compliance.</p>
        <p>The Prussian model of education - standardized curriculum, age-based classes, bells and schedules like factories - was imported to America specifically to produce obedient workers and soldiers. Critical thinking was replaced with standardized testing. Curiosity was replaced with compliance.</p>
        <p>Today's schools teach what to think, not how to think. History is curated. Science is dogma. Questions outside the curriculum are discouraged. Students who don't fit the mold are medicated.</p>
        <p>The system produces consumers, not creators. Employees, not entrepreneurs. Followers, not leaders. And it does this by design - because an awakened population cannot be controlled.</p>
      </>
    )
  },
  {
    id: "v1-ch25",
    title: "Chapter 25: Economics and the Worker Bees",
    content: (
      <>
        <p>Money was once backed by something real. Gold. Silver. Tangible assets that couldn't be created from nothing.</p>
        <p>In 1971, the United States fully abandoned the gold standard. Money became pure fiat - created by decree, backed by nothing except belief. The Federal Reserve, a private bank despite its governmental name, gained the power to create unlimited currency.</p>
        <p>The result: inflation that quietly robs savings, debt that can never be repaid, wealth concentrating in fewer hands while the masses work harder for less.</p>
        <p>This isn't failure - it's design. The system was created to extract value from the many and concentrate it in the few. Debt is the mechanism of control. The worker bees labor to service interest on money that was created from nothing.</p>
        <p>Meanwhile, the families who control the central banks grow wealthier across generations. They fund both sides of wars. They profit from crashes they engineer. They remember what humanity is made to forget: that the money system is a tool of enslavement, not exchange.</p>
      </>
    )
  },
  {
    id: "v1-ch26",
    title: "Chapter 26: The Beast System and the Carousel",
    content: (
      <>
        <p>Revelation describes a system - the beast - that will control buying and selling. "And that no man might buy or sell, save he that had the mark, or the name of the beast, or the number of his name."</p>
        <p>Many wait for this system to arrive. But what if it's already here?</p>
        <p>The cashless society advances. Digital currencies are developed. Social credit systems track behavior. Deplatforming removes the ability to transact. The infrastructure for total financial control exists - it just hasn't been fully activated.</p>
        <p>But the beast system isn't just financial. It's a carousel that cycles people through institutions designed to extract value and enforce compliance: school to work to consumption to debt to death. The cycle repeats each generation.</p>
        <p>Some see it and step off the carousel. Most don't even know they're on it. The matrix of control is invisible to those inside it - normalized, assumed, unquestioned.</p>
        <p>The mark may not be a chip. It may be acceptance of the system itself. The willingness to buy and sell on its terms. The submission to its requirements. The mark in the forehead (what you believe) and the hand (what you do).</p>
      </>
    )
  },
  {
    id: "v1-ch27",
    title: "Chapter 27: The Eye Versus the I - The Pineal Gateway",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART EIGHT: THE WAR ON PERCEPTION</p>
        <p>The pineal gland sits in the center of the brain. Ancient cultures called it the third eye. Modern science confirms it contains photoreceptors identical to the retina. It produces melatonin and DMT. It responds to light even in darkness.</p>
        <p>Jacob named the place where he wrestled with the angel "Peniel" - literally "face of God." The connection is not coincidental.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="text-cyan-300 font-medium">Mattithyahu (Matthew) 6:22</p>
          <p className="italic">"The light of the body is the eye: if therefore your eye be single, your whole body shall be full of light."</p>
        </div>
        <p>What calcifies the pineal? Fluoride (added to water supplies and toothpaste), processed foods, certain medications, alcohol, lack of sunlight, electromagnetic frequencies. The modern environment attacks this gland from every direction.</p>
        <p>What decalcifies it? Clean water, natural foods, sunlight, fasting, meditation, reducing screen exposure, grounding to the earth.</p>
        <p>The pineal is the receiver. The signal is still broadcasting. But if the receiver is calcified, hardened, blocked - the signal can't be received. The war on perception starts with attacking the organ designed to perceive.</p>
      </>
    )
  },
  {
    id: "v1-ch28",
    title: "Chapter 28: The Mirror Trap",
    content: (
      <>
        <p>The adversary shows you a mirror. It looks like truth. It reflects back what you expect to see. But it inverts everything.</p>
        <p>Left becomes right. Forward becomes backward. What appears to advance actually retreats. What seems like truth is its exact opposite.</p>
        <p>This is the trap of institutional religion. It looks like worship of the Creator. It uses His language (sort of). It builds buildings in His honor. But it inverts His name, His calendar, His commandments, His nature.</p>
        <p>The trap works because the mirror is so convincing. Most people never think to look behind it. They accept the reflection as reality and never question whether the image has been reversed.</p>
        <p>Breaking free requires looking away from the mirror. Finding the original source of light. Comparing the reflection to reality and noticing where they differ.</p>
        <p>This is what awakening looks like: turning from the mirror to the window. From the reflection to the source. From the inverted image to the original truth.</p>
      </>
    )
  },
  {
    id: "v1-ch29",
    title: "Chapter 29: Substances That Steal the Signal",
    content: (
      <>
        <p>Alcohol. In Hebrew, the root of "alcohol" connects to the Arabic "al-kuhl" - the body-eating spirit. It's not coincidental that alcohol is called "spirits."</p>
        <p>Alcohol weakens the aura, the spiritual protection around the body. It opens doors to influence. It suppresses the pineal gland's function. It clouds discernment. It creates addiction that prioritizes the substance over everything else.</p>
        <p>Why is alcohol legal and encouraged in nearly every culture, while other substances that might actually open spiritual perception are forbidden? The answer tells you what the system wants: suppression, not awakening.</p>
        <p>Pharmakeia - the Greek word translated as "sorcery" in Revelation - literally means pharmacy. Drugs. Substances. The pharmaceutical industry isn't named accidentally. It operates in the tradition of the sorcerers.</p>
        <p>Not all substances are equal. Some numb. Some addict. Some poison. Some potentially open perception that the system wants closed. The banned list and the promoted list are both designed to serve the same purpose: keeping the receiver offline.</p>
      </>
    )
  },
  {
    id: "v1-ch30",
    title: "Chapter 30: The Frequency War",
    content: (
      <>
        <p>Sound has frequency. Light has frequency. Thought has frequency. Everything vibrates at measurable rates.</p>
        <p>The frequency of 432 Hz is called "Verdi's A" - the tuning that aligns with natural harmonics. Music tuned to 432 Hz reportedly feels more peaceful, more grounded, more connected to nature.</p>
        <p>In 1953, the International Organization for Standardization changed the standard tuning to 440 Hz. All commercial music since then has been tuned to this frequency. Why?</p>
        <p>440 Hz is alleged to create subtle feelings of anxiety and aggression. It doesn't align with natural mathematical ratios. It was promoted, some evidence suggests, by Nazi Germany's propaganda ministry before becoming the global standard.</p>
        <p>This is the frequency war. The music you hear, the signals from your devices, the electromagnetic soup you swim in - all calibrated to frequencies that may disrupt natural resonance, stress the body, and interfere with spiritual perception.</p>
        <p>The solution isn't paranoia. It's awareness. Seek natural frequencies. Spend time in nature, away from electronic signals. Listen to 432 Hz music. Ground yourself to the earth. The war on perception includes attacking the frequencies that perception requires.</p>
      </>
    )
  },
  {
    id: "v1-ch31",
    title: "Chapter 31: The Hidden Cosmology",
    content: (
      <>
        <p>What shape is the Earth? What is the nature of space? What exists above and beyond the sky we see?</p>
        <p>These questions have been answered with such authority by modern science that questioning the answers seems insane. But consider: the answers changed dramatically in the last few centuries, and the change happened to align with agendas that benefited the system.</p>
        <p>Ancient cultures - Hebrew, Egyptian, Mesopotamian, Asian - described a cosmology that's very different from what we're taught. A flat plane covered by a firmament. Waters above and below. A sun, moon, and stars that move across the sky rather than fixed points around which we orbit.</p>
        <p>This isn't an argument for any particular cosmology. It's an observation: the cosmology you accept shapes everything else you believe. If the universe is random, vast, and purposeless, you're an accident. If it was created with intention, with boundaries, with design - you have significance.</p>
        <p>The system benefits from the random, meaningless universe. It produces nihilism, materialism, despair. What if the hidden cosmology reveals a creation far more intimate, far more purposeful, far more centered on humanity than we've been told?</p>
      </>
    )
  },
  {
    id: "v1-ch32",
    title: "Chapter 32: The Hollow Souls",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART NINE: THE HOLLOW WORLD</p>
        <p>Not everyone has the same inner experience. Some people report rich internal lives - constant dialogue with themselves, vivid imagination, deep emotional experience. Others report... nothing. No internal monologue. No imagination. Just reactions to external stimuli.</p>
        <p>This isn't judgment - it's observation. The experience of consciousness appears to vary dramatically between individuals.</p>
        <p>Some traditions describe this as the presence or absence of a soul. Some as the difference between NPC (non-player character) and player. Some as the distinction between those with the breath of the Creator and those who exist without it.</p>
        <p>The theory is uncomfortable, but it explains certain behaviors. Why do some people seem completely uninterested in spiritual matters? Why do some respond to truth with awakening while others never even notice? Why are some drawn to seek while others are content in the matrix?</p>
        <p>We cannot judge individuals. We cannot know who has what. But we can observe that the experience of being human is not uniform - and this may explain more than psychology currently admits.</p>
      </>
    )
  },
  {
    id: "v1-ch33",
    title: "Chapter 33: UFOs and the Alien Deception",
    content: (
      <>
        <p>Unidentified objects in the sky have been documented throughout history. The recent government disclosures confirm what witnesses have reported for decades: something is there.</p>
        <p>But what?</p>
        <p>The prepared narrative is clear: extraterrestrial life. Beings from other planets. Advanced civilizations from distant stars. The conditioning has been constant - movies, TV shows, scientific speculation about habitable exoplanets.</p>
        <p>Consider the alternative: what if these aren't aliens from space but entities from dimensions - the fallen ones, the Watchers, operating just outside normal perception? What if the "disclosure" is preparation for the great deception?</p>
        <p>The fallen know they can't present themselves as demons - that would trigger resistance. But as advanced beings from other stars, offering technology and wisdom? Humanity would welcome them. Worship them, even.</p>
        <p>This may be the coming deception. The revelation of "alien life" that is actually the return of the fallen, packaged in a narrative that the modern mind is prepared to accept. Same entities. Different costume. Same deception.</p>
      </>
    )
  },
  {
    id: "v1-ch34",
    title: "Chapter 34: The Missing Millennium",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART TEN: THE HIDDEN TIMELINE</p>
        <p>What if the calendar itself has been manipulated? What if time has been added, removed, or restructured to hide where we actually are in prophetic history?</p>
        <p>The Phantom Time Hypothesis suggests that approximately 297 years were added to the calendar during the early medieval period. The evidence includes: gaps in archaeological development, inconsistencies in written records, buildings that don't align with their supposed dates.</p>
        <p>Why would this matter? Because if the timeline is manipulated, our understanding of where we are in prophecy is wrong.</p>
        <p>The Hebrew calendar places us in the late 5700s from creation. The Christian calendar places us around 2000 years from the Messiah. But what if neither is accurate? What if we're closer to prophetic endpoints than we realize?</p>
        <p>The system benefits from distorted timelines. If people think they have centuries until prophecy is fulfilled, they remain passive. If they knew the end was near, they might wake up. The manipulation of time is the manipulation of urgency.</p>
      </>
    )
  },
  {
    id: "v1-ch35",
    title: "Chapter 35: The Short Season",
    content: (
      <>
        <p>Revelation 20 describes Satan being bound for a thousand years, then released "for a little season." What if the millennium has already happened, and we're in the short season now?</p>
        <p>The theory suggests: the thousand-year reign of the Messiah occurred during what we call the medieval period. This was the age of cathedral building, of widespread faith, of Christianity spreading across the known world.</p>
        <p>Then Satan was released. The "Renaissance" began - the rebirth of pagan Greek and Roman culture. The Reformation fragmented the church. The Enlightenment elevated human reason above divine revelation. The Industrial Revolution separated humanity from the land. And here we are.</p>
        <p>The short season is marked by deception. By the release of the nations to gather for war. By the final rebellion against the Most High. Does this not describe the trajectory of the last five hundred years?</p>
        <p>This interpretation remains speculative. But it provides a framework for understanding why the deception is so intense, why the systems of control are so comprehensive, why the battle feels so final. We may be living in the short season, watching the last moves of a chess game that began before we were born.</p>
      </>
    )
  },
  {
    id: "v1-ch36",
    title: "Chapter 36: The Coming Deception",
    content: (
      <>
        <p>The Messiah warned: "For there shall arise false Messiahs, and false prophets, and shall show great signs and wonders; insomuch that, if it were possible, they shall deceive the very elect."</p>
        <p>The deception will be convincing. Powerful. Nearly irresistible. Even the elect - those who should know better - will be at risk.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Multi-Level Deception</p>
        <p>Consider the layers of what everyone is waiting for:</p>
        <p>The current Jewish people are still waiting for the <em>first</em> coming of the Messiah - they never accepted Yahusha. Christians are waiting for a <em>second</em> coming. Secular society is waiting for alien contact or technological salvation. Everyone is looking for something.</p>
        <p>What if the true Messiah has already returned? What if the millennial reign has already happened - during what we call the medieval period, when faith spread across the known world and cathedrals rose to heaven? What if history was then erased, reset, and we now find ourselves in Satan's "little season" described in Revelation 20?</p>
        <p>If so, the timeline inverts completely:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p><strong>Traditional teaching:</strong> Rapture → Tribulation → Second Coming → 1000 Year Reign → Satan Released → Armageddon → Judgment</p>
          <p className="mt-2"><strong>The hidden reality:</strong> True Messiah returned → 1000 Year Reign occurred → Reset/Erasure → <em>We are NOW in Satan's little season</em> → False messiah appears → Mark willingly accepted → Script flips → Tribulation → Final Judgment</p>
        </div>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Willing Acceptance</p>
        <p>Imagine a figure appears. Performs miracles. Brings apparent peace. Removes evil - or what appears to be evil. The world unites. For a time, there is harmony.</p>
        <p>He offers a mark - not as oppression but as blessing. Protection. Membership in the saved. Those who refuse are cast as the rebels, the dangerous ones, the threat to the new peace.</p>
        <p>You will not be forced. You will gladly accept. Because if you have already accepted false doctrine in your mind (forehead) and participated in false worship with your body (hand), the physical mark is simply confirmation of what is already spiritually present.</p>
        <p>Then the script flips. The peace becomes persecution. The blessing becomes bondage. And it's too late - the choice was already made.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Pieces on the Board</p>
        <p><strong>Project Blue Beam:</strong> Holographic technology capable of projecting images in the sky. A false rapture. A false return. A technological counterfeit of divine intervention.</p>
        <p><strong>The Alien Disclosure:</strong> "Extraterrestrial" contact that offers solutions to humanity's problems in exchange for worship or compliance.</p>
        <p><strong>A False Prophet:</strong> A religious leader who unifies the world's faiths under a single system that looks like peace but is bondage.</p>
        <p><strong>Technological Mark:</strong> A system that controls buying and selling - but offered willingly, embraced joyfully, by those who believe they're receiving salvation.</p>
        <p>The specifics matter less than the pattern: it will look good. It will offer solutions. It will require something in exchange. And that something will be the rejection of the true Messiah and acceptance of the counterfeit.</p>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Complete Inversion</p>
        <p>Yahusha warned directly about this in Yochanon (John) 16:2:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="italic">"They shall put you out of the assemblies: yea, the time comes, that whosoever kills you will think that he does Elohiym service."</p>
        </div>
        <p>Notice: in the original text, the word is <strong>Elohiym</strong> - not "God." Even the English word "God" traces linguistically to "Gad" (גד), the name of a Canaanite deity of fortune. Another substitution hiding in plain sight, woven into the very language we use to address the Creator.</p>
        <p>The persecutors will believe they're doing righteous work. They'll think they're protecting peace, defending the messiah, cleansing the world of dangerous dissidents. The ones refusing the mark won't be seen as the faithful remnant - they'll be labeled as the threat, the conspiracy theorists, the danger to the new order.</p>
        <p>Those handing out judgment will do so with absolute conviction. They've seen the miracles. They know "the truth." The ones resisting are clearly the deceived - probably influenced by the "evil" that their savior came to defeat.</p>
        <p>This is how discerning people will be deceived. Not by obvious evil - but by convincing good. Not by a monster demanding worship - but by a figure offering peace. The sheep led to slaughter by people who genuinely believe they're shepherds.</p>
        <div className="bg-slate-800/30 p-4 rounded-lg my-4">
          <p><strong>The mark</strong> - offered as blessing, not curse</p>
          <p><strong>The refusers</strong> - seen as the wicked</p>
          <p><strong>The faithful</strong> - called the deceived</p>
          <p><strong>Those thinking themselves saved</strong> - are the ones lost</p>
          <p><strong>The "good people"</strong> - become instruments of judgment against the actual good</p>
        </div>
        
        <p className="text-purple-400 font-medium mt-6 mb-2">The Third Temple</p>
        <p>Many object: "But what about the Third Temple? Doesn't prophecy require it to be rebuilt?" This may be another misdirection. Scripture explicitly states:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="italic">"Do you not know that your body is the temple of the Ruach Ha'Qodesh who is in you?"</p>
          <p className="text-cyan-300 font-medium">Qorintiym Aleph (1 Corinthians) 6:19</p>
          <p className="italic mt-2">"You are being built together to become a dwelling in which Elohiym lives by his Spirit."</p>
          <p className="text-cyan-300 font-medium">Eph'siym (Ephesians) 2:22</p>
        </div>
        <p>Yahusha himself said in Yochanon 2:19: "Destroy this temple and in three days I will raise it up" - speaking of his body, not a building. The temples of old were for worship before the Messiah came. What he changed was not the law but the corruption that had separated humanity from the Father. Direct access was reinstated. You don't have to go to the temple anymore - because it is <em>in you</em>.</p>
        <p>If the "Third Temple" is the body of believers - and that temple already exists in those who carry the Ruach - then everyone watching for a physical building in Yerushalayim is watching the wrong thing. Another misdirection while the real battle is spiritual.</p>
        <p>The "man of sin sitting in Elohiym's temple" (2 Thessalonians 2:4) may refer not to someone occupying a building, but to someone taking over the corrupted church - claiming to lead the true temple while actually leading the counterfeit. The worst anti-messiahs arise from within.</p>
        
        <p className="text-cyan-400 mt-4">The world is already upside down. The deception won't be introduced - it will be revealed. And by then, the choice will have already been made. But knowing the pattern means you won't be caught unaware. That's what this book is for.</p>
      </>
    )
  },
  {
    id: "v1-ch37",
    title: "Chapter 37: The Return of Memory",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART ELEVEN: THE AWAKENING</p>
        <p>What was hidden is being revealed. What was lost is being remembered. The veil is lifting for those with eyes to see.</p>
        <p>More people are questioning than ever before. Information that was once restricted to secret societies is available to anyone with an internet connection. The lies are becoming transparent. The patterns are becoming visible.</p>
        <p>This isn't coincidence. The Father is calling His people. The sheep are hearing the Shepherd's voice. The final separation is occurring - not by geography but by recognition.</p>
        <p>Memory is returning. People remember what they never learned. Truths resonate that were never consciously known. The soul recognizes what the mind never received.</p>
        <p>This is the awakening. Not political. Not merely intellectual. Spiritual. The returning awareness of who you are, where you came from, and what's actually happening in the cosmic drama you were born into.</p>
      </>
    )
  },
  {
    id: "v1-ch38",
    title: "Chapter 38: The Stages of Awakening",
    content: (
      <>
        <p>Awakening follows patterns. Different people experience different sequences, but common stages emerge:</p>
        <p><strong>1. Dissonance:</strong> Something doesn't fit. The official story contradicts observed reality. A crack appears in the programming.</p>
        <p><strong>2. Discovery:</strong> Alternative information enters. Rabbit holes open. Each discovery leads to more questions.</p>
        <p><strong>3. Anger:</strong> The scope of the deception becomes clear. Rage at being lied to. Frustration with those who don't see.</p>
        <p><strong>4. Grief:</strong> Mourning the world you thought you lived in. Sadness for lost time, lost innocence, lost certainty.</p>
        <p><strong>5. Isolation:</strong> The awakened feel alone. Friends and family haven't made the journey. Speaking truth brings rejection.</p>
        <p><strong>6. Integration:</strong> The new understanding settles. Balance returns. Purpose emerges. The awakened finds their role.</p>
        <p><strong>7. Connection:</strong> Others on the same journey are found. Community forms. The isolation ends as fellowship with the like-minded develops.</p>
        <p><strong>8. Mission:</strong> The awakened becomes an awakener. The light received is shared. The pattern continues.</p>
      </>
    )
  },
  {
    id: "v1-ch39",
    title: "Chapter 39: The Collective Awakening",
    content: (
      <>
        <p>Individual awakening matters. But something larger is happening. A collective shift. A global stirring. More people waking up simultaneously than at any previous point in history.</p>
        <p>The internet enabled information sharing that couldn't be controlled. The system tried - censorship, deplatforming, algorithms - but the flow continues. Truth finds a way.</p>
        <p>The events of recent years accelerated the process. Lies became too obvious. Contradictions too glaring. The masks came off - metaphorically and literally. And millions started questioning everything.</p>
        <p>This collective awakening creates momentum. Critical mass approaches. When enough people see, the illusion cannot hold. The spell breaks. The house of cards falls.</p>
        <p>We may be witnessing the beginning of that collapse. Or we may be in for more intensity before the breakthrough. Either way, the direction is clear: the veil is lifting, and no amount of censorship or control can stop what's coming.</p>
      </>
    )
  },
  {
    id: "v1-ch40",
    title: "Chapter 40: The Path Forward",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-4">PART TWELVE: THE RESTORATION</p>
        <p>What do you do when you see?</p>
        <p>First: ground yourself in the original. Study the scriptures with fresh eyes. Learn the names that were erased. Observe the calendar that was substituted. Keep the commandments that were minimized.</p>
        <p>Second: clean the receiver. Detox from the substances that calcify the pineal. Remove the frequencies that interfere. Spend time in nature. Fast. Pray. Listen.</p>
        <p>Third: connect with others. Find fellowship with those who see. Build community. Support each other. The isolation of awakening is temporary - connection is coming.</p>
        <p>Fourth: share what you find. Not by forcing it on others, but by being available when they're ready. The seeds you plant may sprout years later. The conversations you have may echo forward.</p>
        <p>Fifth: build alternatives. The system cannot be reformed - it must be replaced. Build parallel structures. Alternative economies. Independent communities. The infrastructure for what comes next.</p>
        <p>The path forward isn't clear in every detail. But the direction is unmistakable: toward truth, toward the Creator, toward restoration of what was corrupted.</p>
      </>
    )
  },
  {
    id: "v1-ch41",
    title: "Chapter 41: The Witnesses in Stone and Spirit",
    content: (
      <>
        <p>The truth is witnessed everywhere. In the stones of ancient monuments. In the alignments of pyramids. In the precision of structures that supposedly primitive people built with supposedly primitive tools.</p>
        <p>These are witnesses. They testify to a history different from what we're told. Technology we don't understand. Knowledge we haven't recovered. Civilizations whose memory was erased.</p>
        <p>But there are also witnesses in spirit. The prophets and apostles whose words survived tampering. The martyrs who died rather than accept the counterfeit. The remnant in every generation who kept the true faith when everyone around them was deceived.</p>
        <p>You can become a witness. By seeing and speaking. By living what you believe. By standing when others fall. The witness of your life matters. The testimony of your transformation speaks louder than arguments.</p>
        <p>The witnesses in stone remind us that truth persists despite attempts to bury it. The witnesses in spirit remind us that truth lives in people, not just documents. Both are needed. Both continue. Both point toward the same source.</p>
      </>
    )
  },
  {
    id: "v1-ch42",
    title: "Chapter 42: Final Reflections",
    content: (
      <>
        <p>This book is not the end of the journey. It's an invitation to begin.</p>
        <p>What's presented here is incomplete. Some claims will be verified as you dig deeper. Some may prove mistaken. The point isn't to accept everything but to start questioning everything.</p>
        <p>The veil is real. The deception is documented. The pattern of inversion runs through every system we've been told to trust. But the veil is lifting. The deception is failing. The pattern is becoming visible.</p>
        <p>Your role is not passive. You're not just observing a cosmic drama - you're participating in it. Every choice you make, every truth you embrace, every lie you reject moves you toward one side or the other.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="text-cyan-300 font-medium">The Two Requirements</p>
          <p><strong>1. Call upon the name of Yahuah.</strong></p>
          <p><strong>2. Keep His commandments.</strong></p>
        </div>
        <p>That's what the Creator asks. Not seminary education. Not institutional membership. Not ritual performance. Call upon His name. Keep His commandments.</p>
        <p className="text-cyan-400 mt-6">The signal is still broadcasting. The receiver can be restored. The veil is lifting.</p>
        <p>What happens next is between you and the Most High.</p>
        <p className="text-center mt-8 italic text-slate-400">All glory to Yahuah. All honor to Yahusha.<br/>HalleluYah.</p>
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

const journeyChapters: Chapter[] = [
  {
    id: "journey-intro",
    title: "Section Two: The Personal Journey",
    content: (
      <>
        <p className="text-2xl text-purple-400 font-medium mb-6">My Journey Beyond the Veil</p>
        <p>I grew up in Baptist and Methodist churches. I was baptized, attended Sunday school, and went to revivals. I followed the path that was expected of me.</p>
        <p>But even as a child, something felt wrong.</p>
        <p>The message I received never matched the imagery I saw. The words proclaimed one thing while the symbols suggested another. When I raised questions, the answers always ended the same way: "You're not meant to understand everything. That's what faith is for."</p>
        <p>I was given a metaphor: imagine a fence with something beyond it. All you have is a knothole to peek through. See just enough to build faith in what you cannot fully comprehend, then live your life based on that glimpse.</p>
        <p>This never made sense to me.</p>
        <p>How could a loving Creator—one who made us above the angels, in His own image, with the capacity to create—provide only partial information? How could He expect us to navigate the most consequential decision of our existence through guesswork?</p>
        <p>So I turned away. I tried to be my own god. I failed repeatedly. I studied with different denominations, finding that some made more sense than others. But none provided complete answers.</p>
        <p className="text-cyan-400 font-medium mt-6">Until now.</p>
        <p>After decades of confusion, addiction, and searching—after finally quieting my mind long enough to receive something beyond my own noise—the pieces connected. Not through religious dogma or institutional doctrine, but through careful study, honest questioning, and ultimately, clarity.</p>
        <p>What I present in this section is not an attack on Christianity. It is not heresy designed to provoke controversy. It is not an attempt to change your mind.</p>
        <p>It is simply what made sense when I finally allowed myself to look.</p>
        <div className="border-t border-b border-slate-600 my-8 py-6">
          <p>I ask you to consider whether the faith you received has been corrupted—and whether the truth that was always present has simply been veiled.</p>
          <p>If this resonates, explore it further. If it does not, set it aside. That discernment is yours alone.</p>
        </div>
        <p className="text-right italic text-slate-400">Jason Andrews<br/>January 2026</p>
      </>
    )
  },
  {
    id: "journey-ch1",
    title: "Chapter 13: The Awakening",
    content: (
      <>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">The Fog and The Lifting</h3>
        <p>For years, I was lost in addiction. When sobriety finally came, I found myself even more disoriented—because instead of drowning my confusion, I now had to confront it directly. The fog was impenetrable. I knew something was fundamentally wrong with the world, with its systems, with everything I had been taught. But I could not articulate it. I could not break through.</p>
        <p>Alcohol had been my escape. For years, it was the only way I knew to silence the persistent feeling that everything I had been taught was slightly askew—like a picture hanging crooked on the wall that everyone pretends is straight. The drinking solved nothing. It merely delayed the inevitable confrontation with truth.</p>
        <p>When I finally achieved sobriety, clarity did not arrive immediately. First came rawness. Every emotion I had suppressed for decades struck at once: shame, regret, confusion, and the recognition that I had spent years running from something I could not even name.</p>
        <p>The first instinct that emerged as the fog began to lift was not self-focused. It was about giving back—helping animals, helping people who had been wounded. This surprised me. I had expected to concentrate on rebuilding myself. But I came to understand that service to others is the truest form of self-restoration. When you align with purpose, you heal.</p>
        <p>Then the insights began arriving. Not all at once, but in waves. Some mornings I would wake feeling as though I had forgotten everything from the day before. Then suddenly, unprecedented clarity would flood in. I learned to document these moments when they occur, because they do not always remain.</p>
        <p>The fog lifts gradually. You do not awaken one day with perfect vision. You awaken able to see slightly further than yesterday. Eventually, you realize you can perceive the entire landscape—the deception, the truth, the path forward. Clarity is earned, not bestowed.</p>
        
        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Wall and True Seeing</h3>
        <p>For years, I felt as though a wall stood in my thinking. I sensed that something was wrong with how the world operates. I could perceive the deception. But I could not see past it or articulate what lay beyond.</p>
        <p>The problem was that I was attempting to see through the lens I had been given. Our biological eyes are instruments of physical protection. They prevent us from walking off cliffs. They detect material danger. That is their purpose. The image they create is actually inverted in the brain—we do not see reality directly; we see a processed interpretation of it.</p>
        <p>Consider this: the world you perceive is literally upside down in your brain, then corrected through neural processing. You are not experiencing reality. You are experiencing an interpretation of it—a simulation constructed by biological hardware designed for survival, not for truth.</p>
        <p>But there exists another form of perception. Call it discernment. The inner eye. The pineal gland. The third eye. Different traditions assign different names, but all point toward the same phenomenon: a mode of perception that transcends the physical senses.</p>
        <p>This inner sight does not invert. It recognizes pattern, truth, and deception without intermediary processing. When the wall finally breaks, you begin seeing with this eye rather than merely through the lenses. It is the difference between a filtered camera and direct observation.</p>
        <p>Suddenly, everything becomes simple. Not easy—simple. The complexity itself was the deception. The truth was always present, hidden in plain sight. The elaborate game they are playing becomes visible. It was before us all along.</p>
        <p>The greatest difficulty is not developing this sight. It is unlearning everything that obstructs it. Fluoride calcifies the pineal gland. Constant stimulation keeps the mind too occupied to listen. Fear-based programming activates survival responses that suppress discernment. All of it functions to keep that inner eye closed.</p>
        <p>But it can be opened. It was designed to be opened. That is what this journey is about.</p>
        
        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">Created in His Image</h3>
        <p>Scripture tells us we were created in God's image. Most interpret this as physical resemblance—that the Creator possesses two arms, two legs, a face like ours. I believe the meaning runs far deeper.</p>
        <p>I believe it means we were endowed with the ability to create. Not merely to exist, but to build, to express, to transmit. To observe another person and recognize not randomness, but the handiwork of a creator. To conceive ideas and manifest them into reality. This is the image—the creative essence itself.</p>
        <p>Observe what humans do instinctively. We build. We create art. We compose music. We tell stories. We transform raw materials into things that never existed before. No other creature does this as we do. This is the divine spark—the fragment of the Creator's essence residing within each of us.</p>
        <p>There is also the moral compass—the one that exists without instruction. You can be told that something wrong is right. You can be conditioned to accept deception. The indoctrination can run deep. But you will feel the dissonance. That sensation—that knowing that something is wrong even when you cannot articulate why—is the gift. It can be suppressed, but never eliminated.</p>
        <p>Children possess this naturally. They recognize unfairness before anyone teaches them the concept. They sense the wrongness of cruelty before they have language for it. This is not learned behavior. It is intrinsic. It is the Creator's signature inscribed in our souls.</p>
        <p>Everyone possesses this compass. Most have forgotten how to heed it. The world is loud. The programming is relentless. But beneath all of it, the compass still points toward truth. You need only become quiet enough to perceive it again.</p>
        <p>When scripture states that we were made "a little lower than the angels," it speaks not of weakness but of position. We were placed in this realm with creative capacity and moral understanding—faculties the angels themselves do not possess in the same manner. We are not lesser. We are different. And that difference is significant.</p>
      </>
    )
  },
  {
    id: "journey-ch2",
    title: "Chapter 14: The System and Its Weapons",
    content: (
      <>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">The Fragmented System</h3>
        <p>The current system—financial, political, spiritual—profits from confusion. Every bewildering interface maintains dependency. Every expert speaking in jargon cultivates feelings of inadequacy. Every gala where the powerful conduct themselves like deities keeps ordinary people looking upward instead of forward.</p>
        <p>They have no interest in resolution. They convene symposiums and promise progress while extracting value from the disorder. If they desired change, change would occur. The will is absent because the incentives are inverted. They profit from the chaos.</p>
        <p>The fragmentation is not an error. It is the design. For them.</p>
        <p>Examine any institution—government, education, healthcare, religion—and you will discover the same pattern. Complexity that serves administrators rather than people. Rules requiring interpreters. Systems demanding intermediaries. All constructed to maintain your dependence on others' expertise.</p>
        <p>Meanwhile, ordinary people simply want to live morally. But they have been taught that humans are inherently corrupt. That goodness requires intermediaries. That personal discernment cannot be trusted. That the system exceeds their comprehension. This cultivated helplessness is the strategy.</p>
        <p>The religious version is particularly insidious. You require a priest to address God. You require a theologian to interpret scripture. You require an institution to validate your faith. None of this appears in the original texts. All of it was appended by those who benefit from controlling the gates.</p>
        <p>The truth is far simpler. You possess direct access. The Creator did not engineer a system requiring another's permission to connect. That is a human invention, crafted for control. Once perceived, it cannot be unseen.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">Fear as the Weapon</h3>
        <p>The entire system operates on fear. This is not coincidental.</p>
        <p>Fear is the paramount emotion—reserved for survival. Fight or flight. When a predator pursues you, fear preserves your life. It compels immediate reaction without deliberation. That is its purpose.</p>
        <p>But they discovered something: trigger that same fear response in the absence of genuine danger, and you can control people. Compel them to react without thinking. Make them accept what they would never accept in a state of calm discernment.</p>
        <p>So they constructed a system founded on fear. Fear of hell. Fear of missing out. Fear of being abandoned. Fear of being wrong. Fear of punishment. Fear of exclusion. Every decision made from that fearful state becomes a mistake—because fear circumvents discernment. It produces only reaction.</p>
        <p>The religious implementation is brilliant in its cruelty. Believe this doctrine or burn eternally. Accept this into your heart or face infinite torment. It commandeers the survival instinct and redirects it toward your soul. You are not fleeing a predator—you are fleeing an idea they implanted in your mind.</p>
        <p>I spent years in that condition. Every Sunday brought another altar call. Every night brought the terror that I had not believed correctly, that some technicality would condemn me to eternal fire. I would repeat the prayer for assurance. Again. And again. The certainty never materialized, because it was never designed to materialize. Fear does not produce peace. It produces more fear.</p>
        <p>The remedy for fear is not courage. It is discernment. When you perceive clearly that the threat is fabricated, that the fear was installed by people who profit from your compliance, its power dissolves. You cease fleeing. You begin thinking. And thinking people prove far more difficult to control.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">Isolation and The Outsider</h3>
        <p>Rejection. Social isolation. Separation from the system. These are weapons as well.</p>
        <p>Humans are designed for fellowship—with each other, with spirit, with truth. The architects of this system understand this. If they can isolate you, convince you something is defective within you, persuade you that your failure to belong proves you are broken—they have severed you from the source.</p>
        <p>I have always existed as an outsider. I never belonged. For years, I believed something was wrong with me. Why could I not simply conform? Why could I not be like everyone else?</p>
        <p>In school, I was the student who posed too many questions. In church, I was the one who could not simply accept. In the workplace, I was the employee who recognized management's errors and could not remain silent. Every group I entered, I eventually found myself outside again.</p>
        <p>Now I understand: I could not permit myself to become that person. To sacrifice whatever was necessary to belong. To betray my discernment for the sake of acceptance. That resistance was not weakness—it was preservation.</p>
        <p>Here is the truth about the "in crowd"—the popular, the successful, those who appear to have everything figured out: they are searching as well. They have simply learned to conceal it more effectively. The confidence is performance. The certainty is theater. Beneath it, they are as lost as anyone. They simply chose conformity over standing apart.</p>
        <p>When you recognize this, the anxiety diminishes. Isolation begins to feel less like punishment and more like protection. You were kept separate so you would not be corrupted alongside them.</p>
        <p>Scripture speaks of the "narrow path" that few discover for good reason. The broad road offers comfort. It offers company. Everyone travels it together. But it leads somewhere you do not want to arrive. The narrow path is solitary—but it proceeds in the right direction.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Meek and The Innocent</h3>
        <p>Scripture speaks of the meek inheriting the earth. Of protecting the least of these. Of shielding the weak.</p>
        <p>Those experiencing financial hardship often read this and think: "That describes me. I am the meek. I am the least. I am protected."</p>
        <p>But that is not the meaning.</p>
        <p>The meek—the truly innocent—are those who lack the capacity for malicious intent. Consider children before the world corrupts them. Consider adults with conditions such as autism or developmental disabilities. People who, regardless of what befalls them, cannot conceive of malice. They are pure beyond measure. Evil does not exist within them because they lack the mechanism for it.</p>
        <p>I reflect on my experiences with such individuals. Their purity is unmistakable. They can be wounded, yet they do not comprehend revenge. They can be deceived, yet they do not comprehend deception. They operate at a frequency the corrupted cannot access.</p>
        <p>These are the ones scripture protects. These are the ones of whom it declares: whoever harms them might as well fasten a millstone around their neck and cast themselves into the sea. What is done to the least of these is done to the source itself.</p>
        <p>The discerning are meant to protect them. That is part of what discernment serves—not merely to perceive truth, but to shield those who cannot recognize approaching deception. To serve as guardians for the truly innocent.</p>
        <p>When you comprehend this, your purpose clarifies. You are not here solely to save yourself. You are here to protect those who cannot protect themselves from the spiritual predators who govern this world.</p>
      </>
    )
  },
  {
    id: "journey-ch3",
    title: "Chapter 15: The Thin Veil",
    content: (
      <>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">For Those Still Searching</h3>
        <p>If you are reading this while engaged in the same struggle—attempting to penetrate the same barrier—here is what I have learned:</p>
        <p>The wall dissolves when you cease attempting to perceive through the lens you were given and begin trusting the discernment you were born possessing.</p>
        <p>That discomfort you experience when something appears wrong? That is the signal. That is the gift. The confusion was engineered. The truth is simple.</p>
        <p>You are not losing your mind. You are awakening.</p>
        <p>I understand what it means to be told you are wrong when you know you are right. To be dismissed as a conspiracy theorist when you are merely asking questions. To observe people accepting what makes no sense and wonder whether you are the one who is broken.</p>
        <p>You are not broken. You are functioning exactly as designed. That sense of wrongness is your spiritual immune system operating correctly. Those who do not feel it are the ones who have been compromised.</p>
        <p>The path forward does not require convincing others. It requires trusting yourself. Honoring that inner knowing even when everyone around you calls it foolishness. Remembering that prophets were never popular in their own time.</p>
        <p>If you are searching, continue searching. If you are questioning, continue questioning. Truth does not fear examination—only falsehood requires protection from scrutiny. The fact that you persist in searching means you have not surrendered. That is everything.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Veil Is Thin</h3>
        <p>What astonishes me most is this: the veil separating truth from deception is remarkably thin.</p>
        <p>The scope appears overwhelming. Comprehending everything seems impossible. Revising your worldview after decades of programming? As a single individual, contending against the machinery of deception? The mind wants to shut down at the mere thought. Spiritual truth seems equally daunting—so vast, so layered, so impossible to disentangle.</p>
        <p>But the lie itself? The deception? It is actually simple.</p>
        <p>Once perceived, it cannot be unperceived. Then you begin recognizing how pervasive it is. How it exists everywhere, yet nobody attends to it. Minds close. Pineal glands calcify. Questions are discouraged. The ancient knowledge of ether and traditional cosmologies is not taught because "science" supplanted and rewrote everything.</p>
        <p>The reality is straightforward: you need only take one small leap. That is all. The veil is thin. Cross it, and suddenly you stand on the other side, perceiving clearly what was concealed in plain sight all along.</p>
        <p>I remember the moment it occurred for me. It was not dramatic. It was quiet. One connection led to another, and suddenly the entire picture crystallized. Everything I had been taught was wrong—not entirely, but subtly. Just enough to keep me walking in circles rather than forward.</p>
        <p>Now I cannot return. The veil, once crossed, cannot be recrossed. You perceive. You know. You cannot pretend otherwise.</p>
        <p>The veil is thin. Thinner than they want you to believe. One clear moment of perception can transform everything. You are closer than you realize.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Ability to See</h3>
        <p>Despite all the deception—layer upon layer, sufficient to confound anyone into perpetual circles—humans retain the capacity to perceive directly through it.</p>
        <p>Clearly. Directly through it.</p>
        <p>If you attend carefully. If you set aside selfishness, presumed knowledge, ego, and the forces that govern you. Cultural and social engineering has misdirected these instincts. This explains my addiction. This explains my confusion and depression. I sensed something was wrong, but all I knew was to have faith that Jesus would save me, and it never achieved coherence.</p>
        <p>Clarity does not derive from intelligence. Some of the most brilliant people I know are the most deceived. Education can constitute programming. Credentials can become chains. The ability to perceive is not about intellectual capacity—it concerns humility. It requires acknowledging that what you were taught might be wrong.</p>
        <p>Now everything I am learning achieves alignment. The truth was provided from the beginning. It was subverted, inverted, veiled. But despite all of that, the capacity to perceive through it endures. It remains.</p>
        <p>You need only eyes to see. Ears to hear. Willingness to listen rather than merely accept and proceed.</p>
        <p>The greatest obstacle is not the complexity of the deception. It is pride. The refusal to acknowledge that you have been wrong. That the faith upon which you constructed your life was corrupted. That the name to which you prayed was a substitution. That barrier is internal—and only you can dismantle it.</p>
        <p>But once you do, the sight is permanent. Truth, once perceived, cannot be unperceived. You can only determine what to do with it.</p>
      </>
    )
  },
  {
    id: "journey-ch4",
    title: "Chapter 16: The Revelation",
    content: (
      <>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">The 3D Classroom</h3>
        <p>We were given a three-dimensional reality. Not as imprisonment, but as a classroom.</p>
        <p>A place for spiritual maturation. Equipped with every tool we require. Every piece of information we need. Including an extraordinary examination—the deception, the veil, the counterfeit system—which was not part of the original design but became the narrative.</p>
        <p>And the Father declared: I will conclude this. Have faith.</p>
        <p>Consider this reality as a simulation—not in the materialist sense, but in the spiritual sense. A contained environment where souls develop. Where choices bear consequences. Where the curriculum is discernment, and the final examination is perceiving through the veil.</p>
        <p>People assume time is linear. A straight line expanding infinitely into the cosmos. But I believe time is cyclical. Everything recurs. Everything echoes. Examine any narrative and you observe it reverberating across history, consistently advanced by those who possess power and wealth.</p>
        <p>The same patterns. The same deceptions. The same tests. Each generation believes itself unprecedented, yet they traverse the same path their ancestors walked. The question is whether you will recognize the pattern or proceed blindly as those before you did.</p>
        <p>The test is to perceive through it. To discover the truth that was always present. To mature despite the confusion. And to guide others once you have found your way.</p>
        <p>We are not intended to remain in the classroom indefinitely. There is graduation. An exit. A restoration to what we were meant to be before the corruption. This life is temporary—but its lessons are eternal.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">Free Will and The Knowing</h3>
        <p>Someone once presented their theory to me: if the Creator knows everything and created everything, then He created both good and evil. He knows every decision we will make. Everything is predetermined. Nothing we choose matters because it is all scripted.</p>
        <p>I understand this reasoning. When the teachings you received make no sense, and you attempt to reconcile omniscience with free will, it appears contradictory.</p>
        <p>But here is what I have come to understand: Knowing is not controlling.</p>
        <p>A parent knows their child will fall while learning to walk. This does not mean the parent caused the fall. Foreknowledge differs from causation. The Creator can perceive every path while still permitting us to choose which one to walk.</p>
        <p>Scripture states He knew every hair on your head before you were born. This does not mean He controls your every movement. It means He crafted you with care—as a master artisan creates a piece of furniture, only infinitely more complex. A biological vessel designed to contain a spirit. A breath. His essence.</p>
        <p>We were created as a collective for fellowship under the Creator who provided this opportunity to exist. Through free will, He hopes—rather than compels—that we will make righteous decisions. That we will employ our discernment correctly. The entire purpose of free will is its authenticity. The choice belongs to us. Otherwise, why test? Why create? Why any of it?</p>
        <p>Your choices matter. Your discernment matters. The test is genuine. And the outcome is not predetermined—it is earned.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Spark of Life</h3>
        <p>Science recently documented something remarkable: when a sperm penetrates an egg, there is a visible flash of light.</p>
        <p>A flash. At the precise moment of conception.</p>
        <p>They term it a zinc spark. They measure it. They explain it through chemistry. But consider what it represents: the moment life commences, there is light.</p>
        <p>That is the spark. That is the breath of life entering the biological vessel. That is the promise manifesting.</p>
        <p>I have observed the images. The recordings. Researchers studying fertilization captured it without comprehending what they witnessed. They measure luminescence and publish findings. But they are documenting the arrival of a soul and labeling it chemistry.</p>
        <p>Originally, we were designed for eternal existence. Simply follow the law. Commune with the Creator. Dwell in the garden. But corruption arrived—the corruption of DNA through the fallen, the mingling of what should never have been combined—and here we find ourselves.</p>
        <p>Yet even now, even in this corrupted condition, every new life begins with a flash of light. The Creator's signature persists, even in a fallen world.</p>
        <p>Science observes it and classifies it as chemistry. But with eyes to see, you recognize what it truly is. The spark is not zinc. It is the commencement of a soul.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Real Corruption</h3>
        <p>People believe death arrived because Adam and Eve consumed an apple. That is the simplified narrative. One bite of fruit, and the Creator declared: now you shall die.</p>
        <p>But that is the abbreviated version. The metaphor reduced until it lost its meaning.</p>
        <p>The fruit was never about an apple. It concerned the choice to transgress what was forbidden—paralleling Lucifer and the fallen who desired what was not theirs. They sought to attain the Creator's knowledge, to surpass Him.</p>
        <p>What actually transpired was genetic corruption. The mingling of bloodlines. The perfect creation was corrupted by entities who coveted what humans possessed—a position above the angels, made in the Creator's image with the capacity to create.</p>
        <p>Read Genesis 6. "The sons of God saw the daughters of men that they were fair; and they took them wives of all which they chose." The Nephilim. The giants. The corruption of human DNA by non-human entities. This is not allegory—it is documented history that has been minimized and metaphorized until people forgot it was literal.</p>
        <p>That corruption—the mingling of what should never have been combined—introduced death. Not vindictive punishment. A corrupted system failing. A perfect design fractured.</p>
        <p>And rather than total annihilation, rather than eliminating His most treasured creation, the Creator dispatched redemption. The Messiah was not sent to condemn. He was sent to restore what had been corrupted. To offer a path of return.</p>
        <p>The authentic narrative makes sense. They simply do not teach it.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Mark and The Names</h3>
        <p>People imagine the mark of the beast as a microchip. A barcode. Some physical technology implanted in the body. They await it, prepared to resist.</p>
        <p>But what if it is already present? What if it has existed for centuries?</p>
        <p>Scripture indicates the mark will be in your forehead and in your hand. The forehead represents thought—your beliefs, your heart. The hand represents action—your works, your deeds. It is not a chip. It is acceptance and obedience.</p>
        <p>The prayer to accept the false messiah into your heart. The works performed in his name. That is the mark. It is organic. It is spiritual. And most accepted it willingly, believing they were acting righteously.</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p className="italic">"Lord, Lord, we prophesied in your name, we cast out demons in your name, we did mighty works in your name." And the response: "Depart from me, I never knew you."</p>
        </div>
        <p>Why? Because the name is consequential. The name carries the frequency. The name is the connector to the source. If you have received a corrupted name—a substitution, a translation that removes the power—then you are connecting to something else entirely.</p>
        <p>The Father's name appears over 6,800 times in the original Hebrew scriptures. It was replaced with "LORD" and "GOD"—titles, not names. The Messiah's name was altered, translated, modified until it no longer resonates with what was originally given.</p>
        <p>Consider the power of names in scripture. Adam named the animals. To name something is to exercise dominion over it. Names convey authority, identity, frequency. Would you respond if someone addressed you by a different name? The connection depends upon accuracy.</p>
      </>
    )
  },
  {
    id: "journey-ch5",
    title: "Chapter 17: The Declaration",
    content: (
      <>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">The Point of the Spear</h3>
        <p>Christianity is the world's largest religion. The Catholic Church presides at its summit. Billions follow.</p>
        <p>Yet it presents itself as persecuted.</p>
        <p>Consider this. The dominant global religion, spanning every continent, commanding immense wealth and political influence, positioning itself as the underdog. The persecuted faithful, scorned by the world, preserving truth against overwhelming odds.</p>
        <p>This framing confers moral authority. It justifies. It positions. It permits the largest, most powerful religious institution on Earth to claim victimhood while wielding enormous power.</p>
        <p>I characterize Christianity as the point of the spear not because it is inherently evil, but because it has been weaponized. The original faith—the actual teachings, the authentic names, the true understanding—was corrupted through Constantine and his vision of the cross in the sky. World domination disguised as divine mandate. Rome's influence extended through religious conversion.</p>
        <p>Constantine was not a convert seeking truth. He was a politician seeking unity. He took the scattered followers of the Way and molded them into a state religion. The Council of Nicaea was not about truth—it concerned standardization. Control. Establishing one version as official while eliminating alternatives.</p>
        <p>What emerged was not the original. It was an institution engineered for control, using the framework of truth to construct a prison of deception.</p>
        <p>This does not mean everyone within Christianity is malevolent. Most are sincere. Most are genuinely seeking. They have simply received corrupted information and been told it is pure. The fault lies not with the seekers—but with the architects of the deception.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Name on the Razor's Edge</h3>
        <p>People react with anger when you suggest the name they have used might be incorrect. I understand why. It feels like an assault on their relationship with the Creator. On their sincerity. On their entire spiritual existence.</p>
        <p>But consider: if the name was changed, and the change was deliberate, and the change affects the frequency and connection—would you not want to know?</p>
        <p>The Father's name is Yahuah. The Son's name is Yahusha. These are not obscure assertions. They are documented in the original texts. The translations that replaced them—LORD, GOD, Jesus—are the innovations, not the originals.</p>
        <p>Yahusha means "Yahuah saves." The name itself constitutes a declaration of faith, a proclamation of who accomplishes the saving. When you speak the name correctly, you are articulating truth with every syllable. When you employ the substitution, that meaning dissolves.</p>
        <p>I am not claiming that everyone who prayed to Jesus is condemned. I am asking: what if greater power is available? What if the connection you have sought has been deliberately attenuated, and the original frequency remains, awaiting restoration?</p>
        <p>This is the razor's edge. Express it poorly and you appear to be a cult leader. Express it correctly and some will receive it. The name is not magic. It is resonance. And resonance with the source is our design.</p>
        <p>I have experienced the difference. When I began employing the restored names, something shifted. Not immediately. Not dramatically. But something. A clarity. A connection that felt more direct. Perhaps it is psychological. Perhaps not. But I cannot unfeel what I felt.</p>
        <p>All I can do is share what I have discovered. What you do with it remains between you and the Creator.</p>

        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">Why I'm Not Hiding</h3>
        <p>I could employ a pseudonym. Remain anonymous. Present these ideas without exposing myself to scrutiny.</p>
        <p>But that would place me in the same category as those I am questioning. If I am asking you to be honest with yourself, to question what you were taught, to risk your perceived soul for the sake of truth—and I cannot even reveal my own identity? Who would take that seriously?</p>
        <p>My name is Jason Andrews. I am a real person. I have lived a life replete with mistakes and confusion. I was an addict. I was lost. I searched for decades without finding. And now, finally, coherence is emerging.</p>
        <p>I am not rewriting scripture. I would never add to or subtract from what exists. But I am suggesting that they have subtracted—substantially—from the original. The modern church issues warnings that only their version represents truth while consulting texts that have been curated, edited, translated, and stripped of context.</p>
        <p>So yes, this will be labeled heresy by some. Speaking against Christianity while claiming to seek the same Creator they claim to serve—that constitutes the highest offense in religious circles. But here is the reality:</p>
        <p>Ultimately, I will live and die like everyone else. Not because Adam consumed an apple. But because the system was corrupted, and I exist in the aftermath of that corruption, as do we all.</p>
        <p>If speaking the truth as I perceive it exacts a cost, so be it. The alternative is silence. And silence, in the face of what I now perceive, would constitute its own form of betrayal.</p>
        <p>I would rather be wrong and honest than safe and silent.</p>
      </>
    )
  },
  {
    id: "journey-closing",
    title: "Closing Thoughts",
    content: (
      <>
        <p>I do not know where all of this originates. Some days it feels like my own reasoning working through problems. Other days it feels like transmission—receiving something from beyond myself. Perhaps it is both.</p>
        <p>What I know is that I am meant to document it. To speak it. To share it with anyone who has ears to hear. Not for recognition. But because this is my purpose.</p>
        <p className="text-cyan-400 font-medium my-6">The messenger is not the point. The message does the work.</p>
        <p>If this reaches even one person who needed to hear it—one person trapped in the same confusion I experienced, one person whose discernment has been declaring that something is wrong—then it was worth writing.</p>
        <p>The truth has always existed. It was veiled, but not destroyed. Corrupted, but not beyond restoration. And if enough of us begin perceiving clearly, speaking honestly, refusing to accept the substitutions we were given—something shifts.</p>
        <p>I do not know what that shift will resemble. I only know it is necessary. And I know I am meant to participate in it.</p>
        <div className="text-center mt-12 p-6 border border-slate-600 rounded-lg">
          <p className="text-xl font-medium mb-2">To Be Continued...</p>
          <p className="text-slate-400">More is coming. This represents what has arrived thus far.</p>
          <p className="text-slate-400">When the next wave of clarity arrives, it will be added here.</p>
          <p className="text-cyan-400 mt-4">You are not alone in this search. Keep listening.</p>
        </div>
        <p className="text-center mt-8 text-slate-500">
          All glory to Yahuah, the Most High. All honor to Yahusha, the Son.<br/>
          HalleluYah.
        </p>
      </>
    )
  }
];

const appendicesChapters: Chapter[] = [
  {
    id: "concordance",
    title: "Comprehensive Concordance",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-6">Quick reference guide to key terms, names, and concepts used throughout this work.</p>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Divine Names and Titles</h3>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white">Yahuah (יָהוָה)</p>
            <p className="text-sm text-slate-400 mt-1">Paleo-Hebrew: Yod-Hey-Uau-Hey | Pictographic: "Behold the hand, behold the nail"</p>
            <p className="text-sm text-slate-300 mt-2">Pronunciation: Yah-HOO-ah | Meaning: "I AM that I AM" / Self-Existent One</p>
            <p className="text-sm text-slate-400 mt-2">The true name of the Most High, replaced over 6,800 times in the KJV with "LORD." Scripture: Exodus 3:14-15; Psalm 68:4</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-purple-500">
            <p className="font-bold text-white">Yahusha (יָהוּשַׁע)</p>
            <p className="text-sm text-slate-400 mt-1">Paleo-Hebrew: Yah + Yasha (salvation)</p>
            <p className="text-sm text-slate-300 mt-2">Pronunciation: Yah-HOO-sha | Meaning: "Yahuah is Salvation"</p>
            <p className="text-sm text-slate-400 mt-2">The true name of the Messiah. Transliteration path: Hebrew (Yahusha) → Greek (Iesous) → Latin (Iesus) → English (Jesus). Scripture: Matthew 1:21; Acts 4:12</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-pink-500">
            <p className="font-bold text-white">Yah (יָהּ)</p>
            <p className="text-sm text-slate-300 mt-2">Meaning: "I AM" / "He Who Is" - Shortened form preserved in praise (HalleluYah = "Praise Yah")</p>
            <p className="text-sm text-slate-400 mt-2">Also preserved in names: EliYah (Elijah), YeremiYah (Jeremiah), ZecharYah (Zechariah). Scripture: Psalm 68:4</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white">Elohiym / Alohiym (אֱלֹהִים)</p>
            <p className="text-sm text-slate-300 mt-2">Meaning: "Mighty Ones" - Plural form reflecting the echad (unified plurality) nature</p>
            <p className="text-sm text-slate-400 mt-2">"God" is avoided due to potential connection to Gadre'el. See Chapter 21.</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-purple-500">
            <p className="font-bold text-white">Ruach Ha'Qodesh (רוּחַ הַקֹּדֶשׁ)</p>
            <p className="text-sm text-slate-300 mt-2">Meaning: "Set-Apart Breath" or "Set-Apart Spirit"</p>
            <p className="text-sm text-slate-400 mt-2">"Holy" is a Greco-Roman term with pagan origins. "Qodesh" means set apart, separated, distinct.</p>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Key Concepts and Terms</h3>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-red-500">
            <p className="font-bold text-white">The System / Ancient Intelligence</p>
            <p className="text-sm text-slate-300 mt-2">The coordinated adversarial council operating through human proxies, institutions, and bloodlines across millennia. Not bureaucracy or random corruption - an organized spiritual hierarchy executing the rebellion.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 1, Chapter 12, Chapter 26</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-amber-500">
            <p className="font-bold text-white">Pineal Gland / The "I" / Third Eye</p>
            <p className="text-sm text-slate-400 mt-1">Hebrew connection: Peniel (פְּנִיאֵל) - "Face of El" (Genesis 32:30)</p>
            <p className="text-sm text-slate-300 mt-2">Function: Spiritual receiver, discernment center, the "single eye" of Matthew 6:22</p>
            <p className="text-sm text-slate-400 mt-2">Attack vectors: Fluoride calcification, substances, electromagnetic interference, screen addiction. See: Chapter 27, 29, 30</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white">Navigation Lenses (Physical Eyes)</p>
            <p className="text-sm text-slate-300 mt-2">The two physical eyes designed for movement through space, not discernment of truth. With pineal calcified, these become the sole input - easily manipulated through screens and programming.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 27, Chapter 28</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-purple-500">
            <p className="font-bold text-white">"Conspiracy Theorist"</p>
            <p className="text-sm text-slate-300 mt-2">Term created by CIA in 1967 (Document 1035-960) to discredit those questioning the Warren Commission. Not a description of pathology - a weapon to shut down pattern recognition.</p>
            <p className="text-sm text-slate-400 mt-2">Antidote: "What specifically in what I said is incorrect?" - force engagement with content. See: Chapter 10, Chapter 25B</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-pink-500">
            <p className="font-bold text-white">The Nephilim (נְפִילִים)</p>
            <p className="text-sm text-slate-300 mt-2">Meaning: "Fallen ones" or "Giants" - Offspring of Watchers and human women (Genesis 6:1-4)</p>
            <p className="text-sm text-slate-400 mt-2">Present before and after the flood. Bloodlines may continue through ruling families. See: Chapter 4, Chapter 13</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-amber-500">
            <p className="font-bold text-white">The Watchers</p>
            <p className="text-sm text-slate-400 mt-1">Hebrew: Irin (עִירִין)</p>
            <p className="text-sm text-slate-300 mt-2">200 angelic beings who abandoned their station and descended to Mount Hermon. Taught metallurgy, cosmetics, astrology, sorcery, weapons.</p>
            <p className="text-sm text-slate-400 mt-2">Scripture: Genesis 6:1-4; Jude 1:6; Book of Enoch chapters 6-16. See: Chapter 2, 3, 17</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-green-500">
            <p className="font-bold text-white">Sabbath / Shabbat (שַׁבָּת)</p>
            <p className="text-sm text-slate-300 mt-2">The seventh day (Friday sunset to Saturday sunset). Replaced with Sunday (day of the sun god) under Constantine.</p>
            <p className="text-sm text-slate-400 mt-2">Scripture: Genesis 2:2-3; Exodus 20:8-11. See: Chapter 22</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-red-500">
            <p className="font-bold text-white">The Little Season</p>
            <p className="text-sm text-slate-300 mt-2">The period after the Millennial Reign when Satan is released to deceive the nations (Revelation 20:7-8). Theory: The present age may be this little season.</p>
            <p className="text-sm text-slate-400 mt-2">Characteristics: Acceleration, inversion, boldness, convergence of all systems. See: Chapter 34, 35</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white">432 Hz vs 440 Hz</p>
            <p className="text-sm text-slate-300 mt-2">432 Hz: Natural frequency, resonates with body and nature, promotes peace. 440 Hz: Standard tuning adopted 1953, creates subtle dissonance and agitation.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 30</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-amber-500">
            <p className="font-bold text-white">Fluoride</p>
            <p className="text-sm text-slate-300 mt-2">Calcifies the pineal gland more than any other soft tissue. Delivered through water supply, toothpaste, dental treatments. Effect: Jams the spiritual receiver, makes population programmable.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 27, Chapter 29</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-purple-500">
            <p className="font-bold text-white">Vanity / The Mirror Trap</p>
            <p className="text-sm text-slate-400 mt-1">Hebrew: Hevel (הֶבֶל) - vapor, breath, emptiness</p>
            <p className="text-sm text-slate-300 mt-2">Excessive focus on one's own appearance; redirection of worship from Creator to self. One of the seven deadly sins, enabled by constant reflection (mirrors, screens, cameras). The Narcissus myth - dying while staring at one's own reflection.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 28</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white">Faith / Emunah (אֱמוּנָה)</p>
            <p className="text-sm text-slate-300 mt-2">NOT blind belief; firmness, steadfastness, fidelity, reliability. Hebrew root: Aman - to confirm, to support, to be established. Trust built on relationship and experience. "Faith is the SUBSTANCE...the EVIDENCE" (Hebrews 11:1) - faith IS evidence, not absence of evidence.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 28</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-pink-500">
            <p className="font-bold text-white">Mark of the Father / Mark of the Beast</p>
            <p className="text-sm text-slate-300 mt-2">Mark of Father: Forehead (where the pineal gland sits) - open connection to Yahuah through functioning pineal. Mark of Beast: Heart and Hand - where the antichrist spirit is invited through prayer to counterfeit name, and hand does the work of whatever spirit resides in the heart. Not microchip - about what you worship and what you do.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 26</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-red-500">
            <p className="font-bold text-white">Antichrist Spirit</p>
            <p className="text-sm text-slate-300 mt-2">NOT a future man; a spirit invited willingly but unknowingly into the heart. Enters through prayer to the substituted name. "Anti-Christ" opposes already-substituted term - even opposition is controlled.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 26</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-amber-500">
            <p className="font-bold text-white">Amusement / Television / Black Mirror</p>
            <p className="text-sm text-slate-300 mt-2">Amusement: A (without) + Muse (to think) = Without thought. Television: "Tell-a-vision" - content literally called "programming." Black Mirror (smartphone): Portable scrying device - average person gazes into black mirror 96-150 times daily, receiving curated "visions."</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 27, Chapter 30</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-purple-500">
            <p className="font-bold text-white">Spelling / Spellcasting</p>
            <p className="text-sm text-slate-300 mt-2">The arrangement of letters to create effect. Words shape reality, define thought, control perception. Examples: "Gay" redefined, "vaccine" redefined, "gender" redefined.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 10</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white">False Flag Operations</p>
            <p className="text-sm text-slate-300 mt-2">Attack or event designed to appear committed by someone other than actual perpetrators. Documented examples: Reichstag Fire (1933), Gulf of Tonkin (1964), Operation Northwoods (1962 - declassified), USS Liberty (1967). Pattern: Shocking event → immediate perpetrator → emergency response → powers expanded → questioners labeled.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 25B</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-green-500">
            <p className="font-bold text-white">Gehenna (גֵּי הִנֹּם)</p>
            <p className="text-sm text-slate-300 mt-2">Valley of Hinnom - garbage dump outside Jerusalem where refuse was burned and destroyed. Mistranslated as "Hell" implying eternal conscious torment. Truth: Destruction, not preservation in torment. "The wages of sin is death" - not eternal life in agony.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 21</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-pink-500">
            <p className="font-bold text-white">Days of Noah</p>
            <p className="text-sm text-slate-300 mt-2">"As the days of Noah were, so shall also the coming of the Son of Adam be" (Matthew 24:37-39). Same patterns repeating: Nephilim activity, genetic manipulation, corruption of flesh, violence, forbidden knowledge. Modern equivalents: CRISPR, mRNA, pharmaceutical sorcery (pharmakeia).</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 35</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-amber-500">
            <p className="font-bold text-white">Layers of Deception (Seven Identified)</p>
            <p className="text-sm text-slate-300 mt-2">1) Surface narrative 2) "Conspiracy theory" containment 3) Controlled opposition 4) Institutional religion redirect 5) The 1948 deception 6) The Antichrist redirect (watching for future man instead of present spirit) 7) Hidden in plain sight. Navigation only possible through direct connection to signal.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 36</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white">Tartaria / Mud Flood</p>
            <p className="text-sm text-slate-300 mt-2">Tartaria: Theorized previous civilization more advanced than officially acknowledged. Evidence: Buried first floors globally, impossibly ornate architecture, orphan trains, World's Fair structures. Mud Flood: Cataclysmic event that buried the lower levels of buildings worldwide.</p>
            <p className="text-sm text-slate-400 mt-2">See: Chapter 14, 16</p>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Language Inversions Summary</h3>
        
        <div className="grid gap-3 mb-6">
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-red-400 font-medium">God</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Generic title that may connect to Gadre'el/the serpent</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-red-400 font-medium">Lord</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Generic title used for Baal and human masters alike</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-red-400 font-medium">Jesus</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Greek/Latin substitute for Yahusha</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-red-400 font-medium">Hell</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Mistranslation of Gehenna (garbage dump) and Sheol (grave)</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-red-400 font-medium">Holy</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Greco-Roman term; original is Qodesh (set-apart)</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-red-400 font-medium">Christ</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Greek mystery religion term for "anointed"</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-red-400 font-medium">Church</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Greek "kuriakon" replacing Hebrew "qahal" (assembly)</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-red-400 font-medium">Amen</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Possibly invoking Amun, Egyptian sun god</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Calendar Inversions Summary</h3>
        <div className="grid gap-3 mb-6">
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-amber-400 font-medium">Sunday</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Day of the sun god, replacing seventh-day Sabbath</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-amber-400 font-medium">Christmas</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Saturnalia/Sol Invictus birthday, replacing actual birth timing</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-amber-400 font-medium">Easter</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Feast of Ishtar/Eostre, replacing Passover/Firstfruits</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-amber-400 font-medium">Halloween</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Samhain, Celtic festival of the dead, normalized</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Historical Inversions Summary</h3>
        <div className="grid gap-3 mb-6">
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-purple-400 font-medium">Dark Ages</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Possibly the Millennial Reign, deliberately obscured</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-purple-400 font-medium">Tartaria erasure</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Removes evidence of previous advanced civilization</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-purple-400 font-medium">Orphan trains</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Covers population replacement after reset events</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-purple-400 font-medium">Dinosaurs</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Dragons rebranded</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Cosmological Inversions Summary</h3>
        <div className="grid gap-3 mb-6">
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-cyan-400 font-medium">Globe Earth</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Replaces enclosed realm/plane cosmology</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-cyan-400 font-medium">Millions of years</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Replaces young creation timeline</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-cyan-400 font-medium">Evolution</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Replaces divine creation and design</span>
          </div>
          <div className="p-3 rounded bg-slate-800/30 flex justify-between items-center">
            <span className="text-cyan-400 font-medium">Aliens</span>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">Replaces fallen angels as explanation for phenomena</span>
          </div>
        </div>
      </>
    )
  },
  {
    id: "timeline-deception",
    title: "Timeline of Deception",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-6">A chronological overview of the patterns traced throughout this work.</p>
        
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-red-500">
            <p className="font-bold text-white text-lg">The Rebellion (Before Time)</p>
            <ul className="text-sm text-slate-300 mt-2 list-disc list-inside space-y-1">
              <li>The fall of the Watchers</li>
              <li>The corruption of humanity through the Nephilim</li>
              <li>The necessity of the Flood</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white text-lg">The Reset (The Flood)</p>
            <ul className="text-sm text-slate-300 mt-2 list-disc list-inside space-y-1">
              <li>Destruction of the corrupted world</li>
              <li>Preservation of Noah and his family</li>
              <li>The covenant of the rainbow</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-amber-500">
            <p className="font-bold text-white text-lg">The Babylonian Confusion</p>
            <ul className="text-sm text-slate-300 mt-2 list-disc list-inside space-y-1">
              <li>The Tower of Babel</li>
              <li>The scattering of languages</li>
              <li>The beginning of diverse deceptions</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-purple-500">
            <p className="font-bold text-white text-lg">The Roman Hijacking (1st-4th Century AD)</p>
            <ul className="text-sm text-slate-300 mt-2 list-disc list-inside space-y-1">
              <li>The crucifixion of the Messiah</li>
              <li>The substitution of names</li>
              <li>The merger of Christianity with Roman imperialism under Constantine</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-green-500">
            <p className="font-bold text-white text-lg">The Dark Ages / Millennial Reign? (5th-15th Century)</p>
            <ul className="text-sm text-slate-300 mt-2 list-disc list-inside space-y-1">
              <li>The possible thousand years of peace</li>
              <li>The erasure from memory</li>
              <li>The "dark" age that wasn't dark</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-pink-500">
            <p className="font-bold text-white text-lg">The Modern Reset (15th-19th Century)</p>
            <ul className="text-sm text-slate-300 mt-2 list-disc list-inside space-y-1">
              <li>The mud flood events</li>
              <li>The Tartarian erasure</li>
              <li>The orphan trains and population replacement</li>
              <li>The rewriting of history</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-red-500">
            <p className="font-bold text-white text-lg">Satan's Little Season (Present)</p>
            <ul className="text-sm text-slate-300 mt-2 list-disc list-inside space-y-1">
              <li>The bloodline consolidation of power</li>
              <li>The technological acceleration</li>
              <li>The spiritual blindness</li>
              <li>The approaching end</li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: "scripture-cross-reference",
    title: "Cross-Reference of Key Scriptures",
    content: (
      <>
        <p className="text-purple-400 font-medium mb-6">All references from Cepher translation where possible.</p>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">On the Name - Why It Matters</h3>
        <div className="space-y-2 mb-6 text-sm">
          <p className="text-slate-300"><span className="text-cyan-400">Shemoth (Exodus) 3:15</span> - "This is my name forever, and this is my memorial unto all generations"</p>
          <p className="text-slate-300"><span className="text-cyan-400">Yo'el (Joel) 2:32</span> - "Whoever calls on the name of Yahuah shall be delivered"</p>
          <p className="text-slate-300"><span className="text-cyan-400">Yahuchanon (John) 17:6</span> - "I have manifested Your name to the men whom You gave me"</p>
          <p className="text-slate-300"><span className="text-cyan-400">Yesha'yahu (Isaiah) 42:8</span> - "I am Yahuah: that is my name: and my glory will I not give to another"</p>
          <p className="text-slate-300"><span className="text-cyan-400">Ma'asiym (Acts) 4:12</span> - "Neither is there salvation in any other: for there is no other name under heaven given among men, whereby we must be saved"</p>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">On the Eye/Pineal - The True Receiver</h3>
        <div className="space-y-2 mb-6 text-sm">
          <p className="text-slate-300"><span className="text-purple-400">Mattithyahu (Matthew) 6:22-23</span> - "The light of the body is the eye: if therefore your eye be single, your whole body shall be full of light."</p>
          <p className="text-slate-300"><span className="text-purple-400">Bere'shiyth (Genesis) 32:30</span> - "And Ya'aqov called the name of the place Peniy'el: for I have seen Elohim face to face"</p>
          <p className="text-slate-300"><span className="text-purple-400">Yirmeyahu (Jeremiah) 5:21</span> - "Hear now this, O foolish people, and without understanding; which have eyes, and see not"</p>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">On the Watchers and Nephilim</h3>
        <div className="space-y-2 mb-6 text-sm">
          <p className="text-slate-300"><span className="text-pink-400">Bere'shiyth (Genesis) 6:1-4</span> - The sons of Elohim and daughters of men; Nephilim on the earth</p>
          <p className="text-slate-300"><span className="text-pink-400">Yahudah (Jude) 1:6</span> - "The angels which kept not their first estate, but left their own habitation"</p>
          <p className="text-slate-300"><span className="text-pink-400">Bere'shiyth (Genesis) 6:4</span> - "There were giants in the earth in those days; and also after that" (Nephilim before AND after flood)</p>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">On the Little Season and End Times</h3>
        <div className="space-y-2 mb-6 text-sm">
          <p className="text-slate-300"><span className="text-amber-400">Chizayon (Revelation) 20:7-8</span> - "When the thousand years are expired, Satan shall be loosed out of his prison"</p>
          <p className="text-slate-300"><span className="text-amber-400">Mattithyahu (Matthew) 24:24</span> - "False mashiachs, and false prophets, and shall show great signs and wonders"</p>
          <p className="text-slate-300"><span className="text-amber-400">Chizayon (Revelation) 12:12</span> - "The devil is come down unto you, having great wrath, because he knows that he has but a short time"</p>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">On Discernment and Testing</h3>
        <div className="space-y-2 mb-6 text-sm">
          <p className="text-slate-300"><span className="text-green-400">Yahuchanon Ri'shon (1 John) 4:1</span> - "Beloved, believe not every spirit, but try the spirits whether they are of Elohim"</p>
          <p className="text-slate-300"><span className="text-green-400">Tasloniqiym Ri'shon (1 Thessalonians) 5:21</span> - "Test all things; hold fast that which is good"</p>
          <p className="text-slate-300"><span className="text-green-400">Mattithyahu (Matthew) 7:16</span> - "You shall know them by their fruits"</p>
          <p className="text-slate-300"><span className="text-green-400">Mishlei (Proverbs) 25:2</span> - "It is the glory of Elohim to conceal a thing: but the honour of kings is to search out a matter"</p>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">On the Mark - Forehead and Hand</h3>
        <div className="space-y-2 mb-6 text-sm">
          <p className="text-slate-300"><span className="text-red-400">Devariym (Deuteronomy) 6:6-8</span> - "These words... shall be as frontlets between your eyes"</p>
          <p className="text-slate-300"><span className="text-red-400">Chizayon (Revelation) 13:16-17</span> - "He causes all... to receive a mark in their right hand, or in their foreheads"</p>
          <p className="text-slate-300"><span className="text-red-400">Chizayon (Revelation) 14:1</span> - "Having his Father's name written in their foreheads"</p>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">On the Inversion of Good and Evil</h3>
        <div className="space-y-2 mb-6 text-sm">
          <p className="text-slate-300"><span className="text-purple-400">Yesha'yahu (Isaiah) 5:20</span> - "Woe unto them that call evil good, and good evil; that put darkness for light, and light for darkness"</p>
          <p className="text-slate-300"><span className="text-purple-400">Romaiym (Romans) 1:25</span> - "Who changed the truth of Elohim into a lie, and worshipped and served the creature more than the Creator"</p>
        </div>
      </>
    )
  },
  {
    id: "research-directions",
    title: "Research Directions & Documented Sources",
    content: (
      <>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Research Directions</h3>
        <p className="text-slate-400 mb-4">For those who wish to investigate further, these areas warrant attention:</p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-slate-800/50">
            <p className="font-bold text-purple-400 mb-2">Historical Research</p>
            <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
              <li>The Phantom Time Hypothesis</li>
              <li>Tartaria and the Old World Order</li>
              <li>The orphan train records</li>
              <li>The World's Fairs of the late 1800s</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50">
            <p className="font-bold text-cyan-400 mb-2">Scientific Research</p>
            <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
              <li>Fluoride and pineal gland calcification</li>
              <li>The effects of 432 Hz vs. 440 Hz tuning</li>
              <li>Electromagnetic field effects on biology</li>
              <li>DNA as information storage</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50">
            <p className="font-bold text-pink-400 mb-2">Scriptural Research</p>
            <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
              <li>The Book of Enoch (complete text)</li>
              <li>The Book of Jasher</li>
              <li>Septuagint vs. Masoretic Text differences</li>
              <li>The original Hebrew names and meanings</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50">
            <p className="font-bold text-amber-400 mb-2">Alternative History</p>
            <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
              <li>The giants of old and their physical evidence</li>
              <li>Dragon accounts in historical records</li>
              <li>The buried first floors globally</li>
              <li>Timeline and calendar manipulations</li>
            </ul>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Documented Sources and Verifiable References</h3>
        <p className="text-slate-400 mb-4">The following claims made in this book can be verified through publicly available documents, official records, and primary sources.</p>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-red-500">
            <p className="font-bold text-white">CIA Dispatch 1035-960 - "Conspiracy Theorist" Origin</p>
            <p className="text-sm text-slate-300 mt-1">Document dated April 1, 1967, declassified under FOIA. Available through National Archives, MaryFerrell.org. Instructions to CIA media assets on how to use the term to discredit Warren Commission critics.</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-purple-500">
            <p className="font-bold text-white">Operation Northwoods</p>
            <p className="text-sm text-slate-300 mt-1">Declassified 1997 under JFK Assassination Records Act. Available at National Security Archive, George Washington University. Joint Chiefs of Staff proposal to stage terrorist attacks on American soil and blame Cuba.</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white">Gulf of Tonkin - Declassified Admission</p>
            <p className="text-sm text-slate-300 mt-1">NSA Historical Study declassified 2005. NSA historian Robert Hanyok's study confirming the August 4, 1964 attack never occurred.</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-amber-500">
            <p className="font-bold text-white">Fluoride and Pineal Gland Calcification</p>
            <p className="text-sm text-slate-300 mt-1">National Research Council (2006), "Fluoride in Drinking Water: A Scientific Review." Luke, J. (2001), "Fluoride Deposition in the Aged Human Pineal Gland," Caries Research 35:125-128.</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-green-500">
            <p className="font-bold text-white">440 Hz Standard Tuning Change</p>
            <p className="text-sm text-slate-300 mt-1">1953 ISO adoption (ISO 16). Previous standards varied; 432 Hz was common in classical period. Verification: International Organization for Standardization records.</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-pink-500">
            <p className="font-bold text-white">Constantine's Sunday Law</p>
            <p className="text-sm text-slate-300 mt-1">Date: March 7, 321 AD. Source: Codex Justinianus, Book 3, Title 12, Law 3. "On the venerable Day of the Sun let the magistrates and people residing in cities rest."</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border-l-4 border-cyan-500">
            <p className="font-bold text-white">Edward Bernays on Propaganda</p>
            <p className="text-sm text-slate-300 mt-1">"Propaganda" (1928): "The conscious and intelligent manipulation of the organized habits and opinions of the masses is an important element in democratic society." Book is in public domain.</p>
          </div>
        </div>
        
        <div className="mt-8 p-6 border border-slate-600 rounded-lg">
          <h4 className="text-lg font-bold text-white mb-2">Note on Sources</h4>
          <p className="text-slate-400 text-sm">Where claims are marked as "theory" or "speculation," no sources are provided because they represent questions rather than established facts. The reader is encouraged to investigate these areas independently.</p>
          <p className="text-slate-400 text-sm mt-2">Where claims are presented as documented history, sources exist and can be verified. The reader is encouraged to obtain and read primary documents rather than relying on secondary interpretations - including this book.</p>
          <p className="text-cyan-400 text-sm mt-4 font-medium">Truth does not fear investigation. Only lies require protection from scrutiny.</p>
        </div>
      </>
    )
  },
  {
    id: "appendix-cepher",
    title: "Appendix: About the Cepher Translation",
    content: (
      <>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Why This Book Uses the Cepher</h3>
        <p>Throughout "Through The Veil," scripture quotations come from the Cepher translation. Many readers will be unfamiliar with this text, as it stands outside the mainstream Bible translations promoted by institutional Christianity. This is not accidental. The Cepher restores what was systematically removed - and that restoration is precisely why it remains relatively unknown.</p>
        
        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Restoration of Set-Apart Names</h3>
        
        <h4 className="text-lg font-semibold text-purple-400 mt-6 mb-3">The Name of the Father: Yahuah</h4>
        <p>The Cepher restores the Father's name as <strong>Yahuah</strong> (יהוה). This name went unmentioned for over two millennia based on the "ineffable name doctrine" - a rabbinical teaching that the name was too sacred to pronounce. However, scripture itself directly contradicts this:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="italic">"I will publish the name of Yahuah: ascribe you greatness unto our Elohiym."</p>
          <p className="text-cyan-300 font-medium mt-2">Devariym (Deuteronomy) 32:1-3</p>
        </div>
        <p>The historian Yocephus (Josephus) records in "Wars of the Jews" that priests pronounced this name prior to the temple's destruction. The pronunciation is constructed from four vowels: <strong>ee (yod) - ah (heh) - oo (vav) - ah (heh)</strong> = Yahuah.</p>
        
        <h4 className="text-lg font-semibold text-purple-400 mt-6 mb-3">The Name of the Son: Yahusha</h4>
        <p>The Messiah's name is restored as <strong>Yahusha</strong> (יהושע), not "Jesus." This name is identical to the Hebrew name of the son of Nun who led Israel into the Promised Land - the one English Bibles call "Joshua."</p>
        <p>The name Yahusha is constructed from two Hebrew words: <strong>Yahuah</strong> (יהוה) and <strong>yasha</strong> (ישע), meaning "to be open, wide, free; to save, rescue, preserve, help, deliver." Thus, the name literally means "Yahuah saves" or "Yahuah is salvation."</p>
        <p>The proof is found in Hebrews 4:8-10, where the Greek text uses "Iesous" but clearly refers to Joshua son of Nun, not the Messiah. The NKJV footnotes this, admitting "Hebrews 4:8 Gr. Jesus, same as Heb. Joshua."</p>
        
        <h4 className="text-lg font-semibold text-purple-400 mt-6 mb-3">The Name "God" and Elohiym</h4>
        <p>The Hebrew word <strong>Elohiym</strong> has been translated in most English Bibles as "God." This English word may connect to the Yiddish title "G_d" - avoiding the spelling <strong>Gad</strong> (pronounced "gawd").</p>
        <p>Scripture warns against this very substitution:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
          <p className="italic">"But you are they that forsake Yahuah, that forget my holy mountain, that prepare a table for Gad, and that furnish the drink offering to Meniy."</p>
          <p className="text-purple-300 font-medium mt-2">Yesha'yahu (Isaiah) 65:11</p>
        </div>
        
        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Books That Were Removed</h3>
        <p>The Cepher includes books that adherents to the post-19th Century Protestant Bible will not recognize:</p>
        <ul className="list-disc list-inside space-y-1 text-slate-300 my-4">
          <li>Cepher Yovheliym (Jubilees)</li>
          <li>Cepher Chanoch (Enoch)</li>
          <li>Cepher ha'Yashar (Jasher)</li>
          <li>Cepheriym Baruch</li>
          <li>Cepheriym Esdras (Ezra)</li>
          <li>Cepheriym Makkabiym (Maccabees)</li>
        </ul>
        <p>The sixty-six-book reduction was the result of the Westminster Confession, where Parliament reversed itself to give favor to Scottish Presbyterians. The reduction of the text of scripture was exclusively an Anglican political act, not a theological conclusion consistent with the development of scripture.</p>
        
        <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-4">The Prayer of the Cepher</h3>
        <p>It is the most fervent prayer of the translators that these corrections are found true and pleasing to <strong>Yahuah Elohaynu</strong> (Yahuah our Elohiym), and that they would come to bless you in your pursuit of the Truth to which you were called:</p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-cyan-500">
          <p className="italic">"Who has ascended up into heaven, or descended? Who has gathered the wind in his fists? Who has bound the waters in a garment? Who has established all the ends of the earth? What is His name, and what is His Son's name, if you can tell?"</p>
          <p className="text-cyan-300 font-medium mt-2">Mishlei (Proverbs) 30:4</p>
        </div>
        
        <div className="mt-8 p-6 border border-slate-600 rounded-lg text-center">
          <p className="text-slate-400 text-sm">This appendix summarizes key points from the Preface of <em>The Cepher</em> (3rd Edition), published by Cepher Publishing Group, LLC.</p>
          <p className="text-cyan-400 mt-2">For the complete text with all 87 books and restored Hebrew names, visit <strong>cepher.net</strong></p>
        </div>
      </>
    )
  }
];

const volumes: Volume[] = [
  {
    id: "section1",
    title: "Section One",
    subtitle: "The Evidence",
    chapters: volume1Chapters
  },
  {
    id: "section2",
    title: "Section Two",
    subtitle: "The Journey",
    chapters: journeyChapters
  },
  {
    id: "appendices",
    title: "Appendices",
    subtitle: "Reference Materials",
    chapters: appendicesChapters
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
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [returnLocation, setReturnLocation] = useState<{ volume: number; chapter: number } | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);
  
  const navigateToConcordance = () => {
    setReturnLocation({ volume: currentVolume, chapter: currentChapter });
    const appendicesIndex = volumes.findIndex(v => v.id === "appendices");
    if (appendicesIndex !== -1) {
      setCurrentVolume(appendicesIndex);
      setCurrentChapter(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const returnToPreviousLocation = () => {
    if (returnLocation) {
      setCurrentVolume(returnLocation.volume);
      setCurrentChapter(returnLocation.chapter);
      setReturnLocation(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const extractTextForPdf = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (!node) return '';
    if (Array.isArray(node)) return node.map(extractTextForPdf).join('');
    if (typeof node === 'object' && 'props' in node) {
      const element = node as React.ReactElement<{ children?: React.ReactNode; className?: string }>;
      const children = extractTextForPdf(element.props?.children);
      const tag = (element.type as string);
      if (tag === 'p') return `<p>${children}</p>`;
      if (tag === 'strong' || tag === 'b') return `<strong>${children}</strong>`;
      if (tag === 'em' || tag === 'i') return `<em>${children}</em>`;
      if (tag === 'div') {
        const cls = element.props?.className || '';
        if (cls.includes('bg-slate-800') || cls.includes('border-l-4')) {
          return `<blockquote>${children}</blockquote>`;
        }
        return `<div>${children}</div>`;
      }
      if (tag === 'br') return '<br/>';
      return children;
    }
    return '';
  };

  const handleDownloadPDF = () => {
    const volumeTitle = currentVolume === 0 ? "Volume-1-Research" : "Volume-2-Testimony";
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const volumeData = volumes[currentVolume];
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
            <p style="margin-top: 40px; color: #666;">By Jason Andrews</p>
            <p style="margin-top: 60px; color: #888; font-size: 14px;">Note: This PDF version may not include cross-references and interactive features available at dwtl.io/veil/read</p>
          </div>
          <div class="no-print" style="background: #fffbe6; padding: 15px; margin-bottom: 30px; border-radius: 8px;">
            <strong>To save as PDF:</strong> Press Ctrl+P (or Cmd+P on Mac), then select "Save as PDF" as your printer.
          </div>
          ${volumeData.chapters.map((ch: Chapter) => `
            <h1>${ch.title}</h1>
            <div>${extractTextForPdf(ch.content)}</div>
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

  // Split text into chunks at sentence boundaries (roughly 4500 chars to stay under 5000 limit)
  const splitIntoChunks = (text: string, maxLength: number = 4500): string[] => {
    const chunks: string[] = [];
    let remaining = text;
    
    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        chunks.push(remaining);
        break;
      }
      
      // Find a good break point (end of sentence) near the limit
      let breakPoint = remaining.lastIndexOf('. ', maxLength);
      if (breakPoint === -1 || breakPoint < maxLength * 0.5) {
        breakPoint = remaining.lastIndexOf('? ', maxLength);
      }
      if (breakPoint === -1 || breakPoint < maxLength * 0.5) {
        breakPoint = remaining.lastIndexOf('! ', maxLength);
      }
      if (breakPoint === -1 || breakPoint < maxLength * 0.5) {
        breakPoint = remaining.lastIndexOf('\n', maxLength);
      }
      if (breakPoint === -1 || breakPoint < maxLength * 0.3) {
        breakPoint = maxLength; // Hard cut if no good break point
      } else {
        breakPoint += 1; // Include the punctuation
      }
      
      chunks.push(remaining.slice(0, breakPoint).trim());
      remaining = remaining.slice(breakPoint).trim();
    }
    
    return chunks;
  };

  const playChunk = async (chunkText: string, isLastChunk: boolean) => {
    try {
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chunkText }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (error.fallback) {
          console.log('ElevenLabs unavailable, falling back to browser voice');
          setUseElevenLabs(false);
          const fullText = audioQueueRef.current.join(' ');
          playWithBrowserSpeech(fullText);
          return;
        }
        throw new Error(error.error || 'Voice generation failed');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        
        // Check if there are more chunks to play
        const nextChunkIndex = currentChunkRef.current + 1;
        if (nextChunkIndex < audioQueueRef.current.length) {
          currentChunkRef.current = nextChunkIndex;
          setCurrentChunkIndex(nextChunkIndex);
          playChunk(audioQueueRef.current[nextChunkIndex], nextChunkIndex === audioQueueRef.current.length - 1);
        } else {
          // Chapter finished - all chunks played
          setIsPlaying(false);
          setIsPaused(false);
          audioQueueRef.current = [];
          currentChunkRef.current = 0;
          
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
            }, 1500);
          }
        }
      };
      
      audio.onerror = () => {
        console.log('Audio error, falling back to browser voice');
        setUseElevenLabs(false);
        playWithBrowserSpeech(audioQueueRef.current.join(' '));
      };
      
      await audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      setIsLoading(false);
      
    } catch (error) {
      console.error('ElevenLabs chunk error:', error);
      setUseElevenLabs(false);
      playWithBrowserSpeech(audioQueueRef.current.join(' '));
    }
  };

  const playWithElevenLabs = async (text: string) => {
    try {
      setIsLoading(true);
      
      // Split into chunks for long chapters
      const chunks = splitIntoChunks(text);
      audioQueueRef.current = chunks;
      currentChunkRef.current = 0;
      setAudioQueue(chunks);
      setCurrentChunkIndex(0);
      
      // Start playing first chunk
      await playChunk(chunks[0], chunks.length === 1);
      
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
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownloadPDF}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                title="Download as PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline text-xs ml-1">PDF</span>
              </Button>
              <a href="/assets/Through-The-Veil-EBOOK.epub" download>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  title="Download EPUB for e-readers"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden md:inline text-xs ml-1">EPUB</span>
                </Button>
              </a>
            </div>
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

          {chapter.id === "scripture-cross-reference" && !returnLocation && (
            <div className="mb-6 p-4 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-between">
              <span className="text-cyan-300 text-sm">View full definitions of all terms mentioned</span>
              <Button
                size="sm"
                onClick={navigateToConcordance}
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                <BookMarked className="w-4 h-4 mr-2" />
                View Concordance
              </Button>
            </div>
          )}

          {returnLocation && volume.id === "appendices" && (
            <div className="mb-6 p-4 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-between">
              <span className="text-purple-300 text-sm">You came here from a cross-reference</span>
              <Button
                size="sm"
                onClick={returnToPreviousLocation}
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Reading
              </Button>
            </div>
          )}

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
