import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Menu, 
  X,
  TrendingUp,
  AlertCircle,
  FileText,
  BarChart3,
  Scale,
  BookOpen,
  Youtube
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 詐騙數據
const fraudData = [
  { year: "2019", cases: 23000, solvedCases: 18400, loss: 73, recovered: 15 },
  { year: "2020", cases: 28000, solvedCases: 21000, loss: 42, recovered: 12 },
  { year: "2021", cases: 35000, solvedCases: 24500, loss: 56, recovered: 14 },
  { year: "2022", cases: 52000, solvedCases: 31200, loss: 69.6, recovered: 18 },
  { year: "2023", cases: 78000, solvedCases: 39000, loss: 88, recovered: 22 },
  { year: "2024", cases: 118000, solvedCases: 47200, loss: 502, recovered: 93.79 },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("intro");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  
  const { data: comments, refetch: refetchComments } = trpc.comments.list.useQuery();
  const createCommentMutation = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.success("留言發表成功！");
      setCommentName("");
      setCommentContent("");
      setCaptchaAnswer("");
      refetchComments();
    },
    onError: (error) => {
      toast.error(error.message || "留言發表失敗，請重試");
    },
  });

  const sections = [
    { id: "intro", label: "前言", icon: BookOpen },
    { id: "data", label: "數據概覽", icon: BarChart3 },
    { id: "policy", label: "政府政策", icon: FileText },
    { id: "controversy", label: "成效爭議", icon: AlertCircle },
    { id: "conclusion", label: "結論", icon: Scale },
    { id: "comments", label: "網友留言", icon: MessageCircle },
  ];

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentName.trim() || !commentContent.trim()) {
      toast.error("請填寫姓名和留言內容");
      return;
    }

    const answer = parseInt(captchaAnswer);
    if (isNaN(answer)) {
      toast.error("請輸入有效的數字");
      return;
    }

    createCommentMutation.mutate({
      name: commentName,
      content: commentContent,
      captchaAnswer: answer,
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = "賴清德政府打詐成效專題分析報告";

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'line':
        url = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Floating Buttons */}
      {/* 贊助按鈕 - 左下角 */}
      <button
        onClick={() => window.open('https://donate.stripe.com/aFacN69CWeQt7nt2Xi4Ja0h', '_blank')}
        className="fixed left-6 bottom-6 z-50 w-16 h-16 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="贊助我們"
      >
        <Heart className="h-8 w-8" />
      </button>
      
      {/* 社群按鈕 - 右下角 */}
      <button
        onClick={() => window.open('https://lin.ee/bXqTdwr', '_blank')}
        className="fixed right-6 bottom-6 z-50 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="加入 LINE 社群"
      >
        <MessageCircle className="h-8 w-8" />
      </button>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/30 backdrop-blur-md supports-[backdrop-filter]:bg-card/20">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">打詐？越打越詐！</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === section.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-card/30 backdrop-blur-md">
            <nav className="container py-4 flex flex-col gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              打詐？越打越詐！
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-destructive leading-relaxed">
              突破天際的百億打詐基金
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-muted-foreground">
              換來的是財損也創新高！
            </h3>
            <div className="flex flex-wrap justify-center gap-4 pt-4">

              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => scrollToSection('share')}
              >
                <Share2 className="h-5 w-5" />
                分享報告
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* 前言 */}
          <section id="intro">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                  前言
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  詐騙犯罪在台灣日益猖獗，不僅造成民眾鉅額財產損失，也嚴重衝擊社會信任。賴清德政府上任以來，將「打詐」列為重要施政目標，並推出一系列政策與法規。本報告旨在客觀分析賴清德政府在打詐方面的成效，檢視其政策措施、實際數據，以及各界對其成效的評價與爭議，以期提供讀者全面且深入的理解。
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 數據概覽 */}
          <section id="data">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  台灣詐騙案件與財損數據概覽 (2019-2025)
                </CardTitle>
                <CardDescription>
                  近年來，台灣的詐騙案件數與財損金額呈現顯著的增長趨勢，尤其在 2024 年達到高峰，引發社會高度關注。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 財損金額趨勢圖 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">歷年財損金額趨勢（億元）</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={fraudData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#e5e7eb"
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      />
                      <YAxis 
                        stroke="#e5e7eb"
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(30, 30, 40, 0.95)', 
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          padding: '12px'
                        }}
                        labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px' }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#ffffff', paddingTop: '20px' }}
                        iconType="line"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="loss" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        name="詐騙財損金額"
                        dot={{ fill: '#ef4444', r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="recovered" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="破案追回金額"
                        dot={{ fill: '#10b981', r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* 案件數比較 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">詐騙案件數比較</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={fraudData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#e5e7eb"
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      />
                      <YAxis 
                        stroke="#e5e7eb"
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(30, 30, 40, 0.95)', 
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          padding: '12px'
                        }}
                        labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px' }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#ffffff', paddingTop: '20px' }}
                        iconType="line"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cases" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        name="詐騙案件數"
                        dot={{ fill: '#f59e0b', r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="solvedCases" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="破案數"
                        dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* 數據分析 */}
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-destructive" />
                    數據分析
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1 text-xl">•</span>
                      <span><strong className="text-foreground">詐騙案件數暴增：</strong>2019 至 2024 年間，從 2.3 萬件增加至 11.8 萬件，增幅達 413%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1 text-xl">•</span>
                      <span><strong className="text-foreground">財損金額飆升：</strong>從 73 億元暴增至 502 億元，增幅達 588%，2024 年單年財損已超過前五年總和</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1 text-xl">•</span>
                      <span><strong className="text-foreground">破案追回成效不彰：</strong>2024 年追回 93.79 億元，僅佔總財損的 18.7%，顯示追贓成效遠落後於犯罪速度</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 text-xl">•</span>
                      <span><strong className="text-foreground">破案率持續下降：</strong>2019 年破案率約 80%，2024 年降至約 40%，顯示打詐效能未跟上犯罪成長</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 政府政策 */}
          <section id="policy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="h-6 w-6 text-primary" />
                  賴清德政府打詐政策與執行
                </CardTitle>
                <CardDescription>
                  為應對日益嚴峻的詐騙情勢，賴清德政府推動了多項打詐政策與法規
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">1. 新世代打擊詐欺策略行動綱領 1.5 版</h3>
                  <p className="text-muted-foreground mb-4">
                    該綱領旨在透過「識詐、堵詐、阻詐、懲詐」四大面向，整合跨部會資源，全面打擊詐騙。
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">識詐（宣導）</h4>
                      <p className="text-sm text-muted-foreground">
                        透過多元管道提升民眾防詐意識。政府宣稱 112 年度分層分眾識詐宣導總觸及人數達 3.3 億人次。
                      </p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">堵詐（攔阻）</h4>
                      <p className="text-sm text-muted-foreground">
                        強化電信、網路等管道的防堵措施。例如，防詐簡訊發送量達 1.4 億則。
                      </p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">阻詐（金融）</h4>
                      <p className="text-sm text-muted-foreground">
                        透過金融機構合作，攔阻詐騙金流。政府宣稱 112 年度攔阻與圈存金額達 93.79 億元。
                      </p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">懲詐（查緝）</h4>
                      <p className="text-sm text-muted-foreground">
                        加強執法機關的查緝與偵辦能力。2024 年相關預算持續投入，以提升科技辦案能力。
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">2. 打詐新四法</h3>
                  <p className="text-muted-foreground">
                    為強化法制基礎，立法院於 2024 年 7 月三讀通過「打詐新四法」，包括《詐欺犯罪危害防制條例》等，旨在從電信、金融、數位平台及刑事法制等層面，建立更完善的打詐治理架構。
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">3. 打詐儀錶板</h3>
                  <p className="text-muted-foreground">
                    政府於 2025 年推出「打詐儀錶板」，定期公布每日詐騙數據，旨在提高資訊透明度，並作為政策檢討與改進的依據。
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 成效爭議 */}
          <section id="controversy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                  打詐成效的爭議與批評
                </CardTitle>
                <CardDescription>
                  儘管政府積極推動打詐政策，但其成效仍受到在野黨與社會各界的廣泛質疑
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-destructive pl-4">
                  <h3 className="text-lg font-semibold mb-2">1. 「越打越詐」的指控</h3>
                  <p className="text-muted-foreground">
                    在野黨普遍批評賴清德政府的打詐成效不彰，認為詐騙案件與財損金額不減反增，呈現「越打越詐」的現象。國民黨與民眾黨立委多次指出，政府投入大量預算，但民眾受害情況並未好轉，質疑政策方向與執行力。
                  </p>
                </div>

                <div className="border-l-4 border-destructive pl-4">
                  <h3 className="text-lg font-semibold mb-2">2. 預算執行與資源分配爭議</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <strong>預算分配不均：</strong>民眾黨立委陳琬惠曾批評「打詐綱領 1.5 版」的 13 億預算中，高達 73.58%（近 10 億元）用於「設備場地整修」，而用於「增補人力」的預算僅佔 8.85%（約 1.1 億元），質疑資源分配不當。
                    </li>
                    <li>
                      <strong>預算刪減：</strong>2025 年底，行政院打詐指揮中心澄清，114 年原本編列的 31.4 萬元預算經立法院刪除後已歸零，引發外界對打詐決心的疑慮。
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-destructive pl-4">
                  <h3 className="text-lg font-semibold mb-2">3. 司法體系過載與離職潮</h3>
                  <p className="text-muted-foreground">
                    巨量詐騙案件對司法體系造成沉重負擔。新北地檢署在 2025 年爆發檢察官離職潮，有 10 名檢察官離職，創下該署最高紀錄。這種情況導致檢察官難以深入追查詐騙集團幕後首腦，可能形成「打小不打大」的現象。
                  </p>
                </div>

                <div className="border-l-4 border-destructive pl-4">
                  <h3 className="text-lg font-semibold mb-2">4. 行政手段爭議</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <strong>封鎖平台爭議：</strong>2025 年 12 月，政府以打詐為由封鎖中國社群平台「小紅書」一年，引發言論自由與政治審查的爭議。
                    </li>
                    <li>
                      <strong>金融管制過嚴：</strong>部分民眾反映，銀行對提領大額現金的嚴格關切措施對守法民眾造成不便，卻未能有效遏止詐騙集團的運作。
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 結論 */}
          <section id="conclusion">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Scale className="h-6 w-6 text-primary" />
                  結論
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  賴清德政府在打詐方面確實投入了大量資源並制定了相關政策與法規。然而，從客觀數據來看，詐騙案件數與財損金額在過去幾年仍呈現增長趨勢，顯示打詐成效與民眾期待之間存在落差。預算分配的爭議、司法體系的過載，以及部分行政手段引發的社會反彈，都成為政府在打詐路上必須面對的挑戰。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  未來，政府在打詐策略上可能需要更精準地分配資源，加強跨部會協調，並從根本上解決司法體系負荷過重的問題。同時，在推動政策時，也需更審慎地考量對民眾權益的影響，並確保行政措施的合法性與合理性，以重建民眾對政府打詐決心與成效的信任。
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 贊助區塊 */}
          <section id="sponsor">
            <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="h-6 w-6 text-accent" />
                  贊助我們
                </CardTitle>
                <CardDescription>
                  您的支持是我們持續產出優質內容的動力
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">信用卡贊助</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      安全便捷的線上支付
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => toast.info("信用卡贊助功能即將推出")}>
                      立即贊助
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">銀行轉帳</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      直接轉帳支持我們
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => toast.info("銀行帳號：請聯繫我們獲取")}>
                      查看帳號
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">其他方式</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      更多贊助選項
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => toast.info("更多贊助方式即將推出")}>
                      了解更多
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 社群分享 */}
          <section id="share">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Share2 className="h-6 w-6 text-primary" />
                  分享報告
                </CardTitle>
                <CardDescription>
                  將這份報告分享給更多人
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="gap-2"
                    onClick={() => handleShare('facebook')}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleShare('twitter')}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleShare('line')}
                  >
                    <MessageCircle className="h-5 w-5" />
                    LINE
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 留言區 */}
          <section id="comments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  網友留言
                </CardTitle>
                <CardDescription>
                  歡迎分享您對本報告的看法
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 留言表單 */}
                <form onSubmit={handleSubmitComment} className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="請輸入您的姓名"
                      maxLength={100}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">留言內容</Label>
                    <Textarea
                      id="content"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="請輸入您的留言..."
                      rows={4}
                      maxLength={1000}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="captcha">驗證問題：3 + 5 = ?</Label>
                    <Input
                      id="captcha"
                      type="number"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      placeholder="請輸入答案"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createCommentMutation.isPending}
                  >
                    {createCommentMutation.isPending ? "發表中..." : "發表留言"}
                  </Button>
                </form>

                <Separator />

                {/* 留言列表 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">所有留言 ({comments?.length || 0})</h3>
                  
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-card border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{comment.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString('zh-TW', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      目前還沒有留言，成為第一個留言的人吧！
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>

      {/* 製作團隊 */}
      <section className="py-12 bg-card/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold text-foreground">製作團隊</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                <img 
                  src="/visionoffuture-logo.png" 
                  alt="直球對決 Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => window.open('https://www.youtube.com/@visionoffuture-2028', '_blank')}
              >
                <Youtube className="h-5 w-5" />
                YouTube 直球對決
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card mt-0">
        <div className="container py-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              視角製作 © 2026
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://lin.ee/bXqTdwr', '_blank')}
              >
                LINE 社群
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://donate.stripe.com/aFacN69CWeQt7nt2Xi4Ja0h', '_blank')}
              >
                贊助我們
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => scrollToSection('comments')}
              >
                留言討論
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
