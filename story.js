window.VN_DATA = {
  backgrounds:{hall:'assets/backgrounds/hall_day.webp',evening:'assets/backgrounds/hall_evening.webp',club:'assets/backgrounds/club_day.webp',night:'assets/backgrounds/club_night.webp'},
  characters:{
    mio:{name:'水瀬 澪',short:'澪',age:20,desc:'文学部2年。放送研究会の脚本担当。静かに見えるが、好きな作品の話になると急に饒舌。',imgs:{neutral:'assets/characters/mio_neutral.webp',smile:'assets/characters/mio_smile.webp',pout:'assets/characters/mio_pout.webp',wink:'assets/characters/mio_wink.webp',closed:'assets/characters/mio_closed.webp'}},
    akari:{name:'橘 朱莉',short:'朱莉',age:21,desc:'工学部3年。音響と編集を担当する行動派。面倒見がよく、肝心なところでは妙に不器用。',imgs:{neutral:'assets/characters/akari_neutral.webp',smile:'assets/characters/akari_smile.webp',blush:'assets/characters/akari_blush.webp',serious:'assets/characters/akari_serious.webp',talk:'assets/characters/akari_talk.webp'}}
  },
  achievements:[
    {id:'first',name:'はじめの一行',desc:'物語を開始した'},
    {id:'mio_profile',name:'脚本家の横顔',desc:'澪のプロフィールを解放した'},
    {id:'akari_profile',name:'波形の向こう側',desc:'朱莉のプロフィールを解放した'},
    {id:'balanced',name:'名ディレクター',desc:'二人の衝突を公平にまとめた'},
    {id:'mio_good',name:'行間の答え',desc:'澪 GOOD ENDを見た'},
    {id:'akari_good',name:'残響の先へ',desc:'朱莉 GOOD ENDを見た'},
    {id:'common',name:'三人の放課後',desc:'COMMON ENDを見た'},
    {id:'collector',name:'境界線の向こう',desc:'3種類のエンディングを見た'}
  ],
  gallery:[
    {id:'intro',name:'はじまりの廊下',bg:'hall'},
    {id:'mio_evening',name:'夕暮れの推敲',bg:'evening'},
    {id:'akari_night',name:'深夜の編集室',bg:'night'},
    {id:'mio_end',name:'澪 — 行間の答え',bg:'evening'},
    {id:'akari_end',name:'朱莉 — 残響の先へ',bg:'night'},
    {id:'common_end',name:'三人の大学祭',bg:'club'}
  ],
  nodes:{
    p0:{ch:'Prologue — 九月、放課後',bg:'hall',lines:[
      {s:'',t:'九月の終わり。講義棟の廊下には、まだ夏の熱が少しだけ残っていた。'},
      {s:'',t:'大学祭まで、あと七日。\nそして俺——{name}は、なぜか放送研究会の部室へ向かっている。'},
      {s:'???',t:'あ。君、新入部員……じゃないよね？',chars:[['mio','right','neutral']]},
      {s:'',t:'振り返ると、台本の束を抱えた女性が立っていた。'},
      {s:'水瀬 澪',t:'水瀬澪。文学部二年。放研では脚本を書いてる。',chars:[['mio','right','smile']],profile:'mio'},
      {s:'澪',t:'もし暇なら、ちょっとだけ助けてほしいことがあるんだけど。'}
    ],choices:[
      {t:'「面白そう。行きます」',next:'p1',mio:2,flag:'eager'},
      {t:'「何をするんですか？」',next:'p1',mio:1,flag:'careful'},
      {t:'「五分だけなら」',next:'p1',mio:-1}
    ]},
    p1:{ch:'Day 1 — 放送研究会',bg:'club',chars:[['mio','left','neutral'],['akari','right','neutral']],lines:[
      {s:'???',t:'澪、それ誰？　まさか本当に通りすがりを捕まえてきたの？'},
      {s:'澪',t:'捕まえてない。交渉した。たぶん。',chars:[['mio','left','pout'],['akari','right','neutral']]},
      {s:'???',t:'それを世間では捕獲って言うんだよ。',chars:[['mio','left','pout'],['akari','right','smile']]},
      {s:'橘 朱莉',t:'私は橘朱莉、工学部三年。音響と編集。よろしく、{name}君。',profile:'akari'},
      {s:'',t:'机の上には、未完成の台本とマイク、そして「大学祭ラジオドラマ」と書かれた進行表。'},
      {s:'朱莉',t:'主演が熱出して離脱。代役も捕まらない。だから——'},
      {s:'澪',t:'あなたに、主人公役を読んでもらいたい。'}
    ],choices:[
      {t:'「演技経験ゼロですけど」',next:'p2',akari:1},
      {t:'「主人公って、どんな役？」',next:'p2',mio:2},
      {t:'「報酬は学食一食で」',next:'p2',akari:2,flag:'meal'}
    ]},
    p2:{ch:'Day 1 — 初収録',bg:'club',chars:[['mio','left','neutral'],['akari','right','talk']],lines:[
      {s:'朱莉',t:'マイクは近づきすぎない。声量より、距離を一定にするのが大事。'},
      {s:'澪',t:'台詞は上手く読もうとしなくていい。相手の言葉を聞いて、返して。'},
      {s:'',t:'二人の指示は正反対に見えて、実際には妙に噛み合っていた。'},
      {s:'朱莉',t:'じゃあテスト。三、二、一——。'}
    ],choices:[
      {t:'澪の書いた台詞の意味を先に聞く',next:'p3',mio:3,flag:'script'},
      {t:'朱莉にマイク位置を細かく確認する',next:'p3',akari:3,flag:'sound'},
      {t:'とにかく一度読んでみる',next:'p3',mio:1,akari:1}
    ]},
    p3:{ch:'Day 2 — 昼休み',bg:'hall',chars:[['mio','right','smile']],lines:[
      {s:'澪',t:'昨日の仮録り、聞いたよ。思ったより自然だった。'},
      {s:'{name}',t:'「思ったより」は余計じゃない？'},
      {s:'澪',t:'褒めてる。私、褒めるの下手だから。'},
      {s:'',t:'澪は窓の外を見たまま、小さく笑った。'},
      {s:'澪',t:'今日、授業のあと空いてる？　台本の直し、少し付き合ってほしい。'}
    ],choices:[
      {t:'一緒に台本を直す',next:'mioStudy',mio:5,flag:'mio_time'},
      {t:'朱莉の音響チェックも手伝う',next:'akariWork',akari:5,flag:'akari_time'},
      {t:'三人でやろうと提案する',next:'p4',mio:2,akari:2}
    ]},
    mioStudy:{ch:'Day 2 — 図書館前',bg:'evening',chars:[['mio','center','closed']],unlock:'mio_evening',lines:[
      {s:'',t:'ベンチで台本を読み直すうち、澪が何度も同じページを直していることに気づいた。'},
      {s:'{name}',t:'ここ、そんなに気になる？'},
      {s:'澪',t:'……告白の場面だから。嘘っぽくしたくない。'},
      {s:'{name}',t:'澪なら、どう言うの？'},
      {s:'澪',t:'それ、脚本の取材？',chars:[['mio','center','pout']]},
      {s:'',t:'返事の代わりに笑うと、彼女は耳まで赤くしてページを閉じた。'}
    ],choices:[
      {t:'「取材ってことにしておこう」',next:'p4',mio:3},
      {t:'「普通に興味がある」',next:'p4',mio:5,flag:'mio_direct'},
      {t:'話題を台本に戻す',next:'p4',mio:1}
    ]},
    akariWork:{ch:'Day 2 — 編集室',bg:'night',chars:[['akari','center','neutral']],unlock:'akari_night',lines:[
      {s:'',t:'朱莉は波形を睨みながら、ノイズを一つずつ削っていく。'},
      {s:'朱莉',t:'音ってさ、消したものほど気になるんだよ。'},
      {s:'{name}',t:'人間関係みたい。'},
      {s:'朱莉',t:'……二十歳にして妙に疲れたこと言うね。',chars:[['akari','center','smile']]},
      {s:'',t:'笑いながらも、朱莉は俺の録音だけ何度も聞き直していた。'},
      {s:'朱莉',t:'声、結構好きかも。録りやすいって意味で。'}
    ],choices:[
      {t:'「録りやすい以外の意味も？」',next:'p4',akari:5,flag:'akari_direct'},
      {t:'「じゃあもっと録ってください」',next:'p4',akari:3},
      {t:'照れて聞かなかったことにする',next:'p4',akari:1}
    ]},
    p4:{ch:'Day 3 — すれ違い',bg:'club',chars:[['mio','left','pout'],['akari','right','serious']],lines:[
      {s:'朱莉',t:'この台詞、尺が長い。BGMの切れ目を越える。'},
      {s:'澪',t:'でも削ったら主人公が決心する理由がなくなる。'},
      {s:'朱莉',t:'聞き手に伝わらなきゃ、理由があっても同じ。'},
      {s:'澪',t:'音に合わせて感情を切るのは違う。'},
      {s:'',t:'空気が凍る。二人とも間違っていないからこそ、止めにくい。'}
    ],choices:[
      {t:'澪の意図を残して台詞を言い換える',next:'p5',mio:4,akari:1,flag:'mediate_words'},
      {t:'朱莉の尺に合わせ間で感情を見せる',next:'p5',akari:4,mio:1,flag:'mediate_sound'},
      {t:'二案とも録って聞き比べる',next:'p5',mio:3,akari:3,flag:'balanced',ach:'balanced'}
    ]},
    p5:{ch:'Day 4 — 雨',bg:'night',chars:[],lines:[
      {s:'',t:'夕方から雨が強くなり、部室には雨音とPCのファンだけが残った。'},
      {s:'',t:'作業は予定より早く終わった。澪も朱莉も、まだ帰る気配がない。'},
      {s:'',t:'誰かと話したい。そう思ったとき、二人の視線がほぼ同時にこちらを向いた。'}
    ],choices:[
      {t:'澪と自販機へ行く',next:'m0',mio:2,route:'mio',minMio:5},
      {t:'朱莉と機材倉庫へ行く',next:'a0',akari:2,route:'akari',minAkari:5},
      {t:'三人でコンビニへ行く',next:'c0',mio:1,akari:1,route:'common'}
    ]},
    m0:{ch:'Mio Route — 雨の自販機',bg:'hall',chars:[['mio','center','neutral']],lines:[
      {s:'澪',t:'……こっちを選ぶんだ。'},
      {s:'{name}',t:'自販機に行くだけで大げさじゃない？'},
      {s:'澪',t:'そういうことにしておく。'},
      {s:'',t:'澪は温かいミルクティーを二本買い、一本をこちらに差し出した。'},
      {s:'澪',t:'脚本、最後だけ決まらないんだ。主人公が相手に何を言うか。'}
    ],choices:[
      {t:'「言葉にしないと伝わらないと思う」',next:'m1',mio:5,flag:'m_words'},
      {t:'「言わなくても伝わることはある」',next:'m1',mio:1,flag:'m_silence'}
    ]},
    m1:{ch:'Mio Route — 本音の行間',bg:'evening',chars:[['mio','center','smile']],lines:[
      {s:'澪',t:'私、小説なら何ページでも書けるのに、自分のことになると一行も書けない。'},
      {s:'{name}',t:'じゃあ、口で言えばいい。'},
      {s:'澪',t:'簡単に言うね。'},
      {s:'{name}',t:'難しくしてるの、澪じゃない？'},
      {s:'',t:'彼女はしばらく黙って、夕焼けの窓に視線を逃がした。'},
      {s:'澪',t:'……そういうところ、ずるい。'}
    ],choices:[
      {t:'「完成したら最初に読ませて」',next:'m2',mio:4},
      {t:'「完成するまで隣にいる」',next:'m2',mio:7,flag:'promise'}
    ]},
    m2:{ch:'Mio Route — 大学祭前夜',bg:'club',chars:[['mio','center','closed']],lines:[
      {s:'',t:'前夜。最後の台詞だけ空白のまま、時計は二十三時を回った。'},
      {s:'澪',t:'ねえ、{name}。もしこの主人公が、ずっと近くにいた人を好きになったなら。'},
      {s:'澪',t:'どんな言葉なら、逃げずに言えると思う？',chars:[['mio','center','pout']]},
      {s:'',t:'それが脚本の相談ではないことくらい、もう分かっていた。'}
    ],choices:[
      {t:'「好きだって、そのまま言う」',next:'mEnd',mio:6,flag:'confess'},
      {t:'「作品が終わってから考えよう」',next:'mEnd',mio:-3}
    ]},
    mEnd:{ch:'Mio Route — Ending',bg:'evening',chars:[['mio','center','wink']],ending:'mio',lines:[
      {s:'',t:'大学祭の放送が終わった夕方、誰もいない廊下で澪が完成稿を渡してきた。'},
      {s:'澪',t:'最後の一行、変えた。'},
      {s:'{name}',t:'「私は、あなたと次の物語を書きたい」……？'},
      {s:'澪',t:'朗読しなくていいから。恥ずかしい。'},
      {s:'',t:'それでも彼女は逃げなかった。俺も、もう行間に隠れるつもりはなかった。'}
    ]},
    a0:{ch:'Akari Route — 機材倉庫',bg:'club',chars:[['akari','center','neutral']],lines:[
      {s:'朱莉',t:'こっち来ると思わなかった。澪のほう、気にしてたでしょ。'},
      {s:'{name}',t:'朱莉先輩も気にしてたから。'},
      {s:'朱莉',t:'……後輩のくせに観察しすぎ。'},
      {s:'',t:'狭い倉庫で、古いマイクとケーブルの匂いに囲まれる。'},
      {s:'朱莉',t:'私、壊れた機材は直せるけど、人の機嫌は直せないんだよね。'}
    ],choices:[
      {t:'「壊れてないですよ」',next:'a1',akari:5},
      {t:'「じゃあ一緒に練習しましょう」',next:'a1',akari:3}
    ]},
    a1:{ch:'Akari Route — 残響',bg:'night',chars:[['akari','center','smile']],lines:[
      {s:'朱莉',t:'編集って、失敗した部分を消せるじゃん。'},
      {s:'朱莉',t:'でも現実はそうじゃない。言ったことも、言わなかったことも残る。'},
      {s:'{name}',t:'残るなら、いい音を重ねればいい。'},
      {s:'朱莉',t:'……そういう返し、反則。'},
      {s:'',t:'ヘッドホンの片側を渡される。距離が、いつもより近い。'}
    ],choices:[
      {t:'同じヘッドホンで最後まで聞く',next:'a2',akari:6,flag:'headphone'},
      {t:'自分の椅子を少し近づける',next:'a2',akari:4}
    ]},
    a2:{ch:'Akari Route — 大学祭前夜',bg:'night',chars:[['akari','center','blush']],lines:[
      {s:'朱莉',t:'完成。……たぶん、今までで一番好きな音になった。'},
      {s:'{name}',t:'作品が？'},
      {s:'朱莉',t:'そういう聞き返し、ほんと性格悪い。'},
      {s:'',t:'朱莉は再生ボタンに指を置いたまま、こちらを見た。'},
      {s:'朱莉',t:'終わったあともさ。たまに、ここ来ない？　用事なくても。'}
    ],choices:[
      {t:'「毎週でも」',next:'aEnd',akari:7,flag:'confess'},
      {t:'「機材が壊れたら」',next:'aEnd',akari:-2}
    ]},
    aEnd:{ch:'Akari Route — Ending',bg:'night',chars:[['akari','center','smile']],ending:'akari',lines:[
      {s:'',t:'大学祭の撤収後。編集室には、二人分の紙コップと完成音源だけが残った。'},
      {s:'朱莉',t:'ねえ。録音してないときくらい、先輩って呼ぶのやめない？'},
      {s:'{name}',t:'じゃあ、朱莉。'},
      {s:'朱莉',t:'……うん。もう一回。'},
      {s:'',t:'何度でも呼べる名前なのに、その一度だけは音源より鮮明に残った。'}
    ]},
    c0:{ch:'Common Route — 三人の夜',bg:'club',chars:[['mio','left','smile'],['akari','right','smile']],lines:[
      {s:'',t:'結局、三人でコンビニの袋を囲みながら修正作業を続けた。'},
      {s:'朱莉',t:'こういうのでいいんだよ。青春って。たぶん。'},
      {s:'澪',t:'朱莉が言うと急に雑。'},
      {s:'{name}',t:'でも、悪くない。'},
      {s:'',t:'恋と呼ぶにはまだ曖昧で、友情と呼ぶには少しだけ近すぎる。'}
    ],choices:[
      {t:'この三人で作品を完成させたい',next:'cEnd',mio:2,akari:2}
    ]},
    cEnd:{ch:'Common Ending — 大学祭',bg:'club',chars:[['mio','left','wink'],['akari','right','smile']],ending:'common',lines:[
      {s:'',t:'本番は成功した。拍手は小さかったけれど、三人には十分だった。'},
      {s:'澪',t:'次、何作る？'},
      {s:'朱莉',t:'もう次の話？　……まあ、やるけど。'},
      {s:'{name}',t:'じゃあ今度は、最初から俺もメンバーってことで。'},
      {s:'',t:'こうして一週間のはずだった放課後は、もう少しだけ続くことになった。'}
    ]}
  }
};
