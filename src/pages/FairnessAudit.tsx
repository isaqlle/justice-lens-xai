import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Shield,
  BarChart3,
  RefreshCw,
  Eye
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from "recharts";

const FairnessAudit = () => {
  // Data for regional comparison
  const regionalData = [
    { region: "Região A (Centro)", avgRisk: 5.8, cases: 324 },
    { region: "Região B (Periferia)", avgRisk: 7.2, cases: 412 },
    { region: "Região C (Subúrbio)", avgRisk: 6.1, cases: 289 },
    { region: "Região D (Rural)", avgRisk: 4.9, cases: 156 },
  ];

  // Data for socioeconomic comparison
  const socioeconomicData = [
    { status: "Baixo", avgRisk: 7.3, fpr: 0.32 },
    { status: "Médio-Baixo", avgRisk: 6.4, fpr: 0.28 },
    { status: "Médio", avgRisk: 5.7, fpr: 0.24 },
    { status: "Médio-Alto", avgRisk: 5.1, fpr: 0.21 },
    { status: "Alto", avgRisk: 4.6, fpr: 0.19 },
  ];

  // Drift monitoring data (last 6 months)
  const driftData = [
    { month: "Jun", correlation: 0.42 },
    { month: "Jul", correlation: 0.44 },
    { month: "Ago", correlation: 0.47 },
    { month: "Set", correlation: 0.49 },
    { month: "Out", correlation: 0.51 },
    { month: "Nov", correlation: 0.52 },
  ];

  const fairnessMetrics = [
    { name: "Disparate Impact Ratio", value: 0.78, threshold: 0.80, status: "warning" },
    { name: "Equal Opportunity Difference", value: 0.09, threshold: 0.10, status: "ok" },
    { name: "Average Odds Difference", value: 0.12, threshold: 0.10, status: "alert" },
    { name: "Demographic Parity Difference", value: 0.08, threshold: 0.10, status: "ok" },
  ];

  const excludedVariables = [
    "Raça/Etnia",
    "Religião declarada",
    "Nome completo",
    "Gênero",
    "Orientação sexual",
    "Naturalidade específica",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok": return "text-confidence-high";
      case "warning": return "text-alert-bias";
      case "alert": return "text-factor-negative";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok": return <Badge className="bg-confidence-high">Conforme</Badge>;
      case "warning": return <Badge className="bg-alert-bias">Atenção</Badge>;
      case "alert": return <Badge className="bg-factor-negative">Crítico</Badge>;
      default: return <Badge>-</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Dashboard de Auditoria de Viés</h1>
              <p className="text-sm text-muted-foreground">Módulo de Explicabilidade Global - Análise de Fairness do Sistema</p>
            </div>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Dados
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Global Fairness Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Status Global de Fairness
                </CardTitle>
                <CardDescription>Avaliação geral do modelo quanto à equidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-alert-bias">Aceitável com Alertas</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      2 de 4 métricas apresentam desvios que requerem atenção
                    </p>
                  </div>
                  <div className="h-24 w-24 rounded-full border-8 border-alert-bias/30 flex items-center justify-center">
                    <AlertTriangle className="h-10 w-10 text-alert-bias" />
                  </div>
                </div>

                <div className="space-y-4">
                  {fairnessMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{metric.name}</span>
                          {getStatusBadge(metric.status)}
                        </div>
                        <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                          {metric.value.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(metric.value / metric.threshold) * 100} 
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          Limite: {metric.threshold.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Comparação Regional de Score Médio
                </CardTitle>
                <CardDescription>
                  Distribuição de risco predito por região geográfica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="region" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="avgRisk" 
                      fill="hsl(var(--alert-bias))" 
                      name="Score Médio de Risco"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <Alert className="mt-4 border-alert-bias bg-alert-bias/10">
                  <AlertTriangle className="h-4 w-4 text-alert-bias" />
                  <AlertDescription className="text-sm">
                    <span className="font-semibold">Disparidade detectada:</span> A Região B apresenta 
                    score médio 24% superior à Região A, indicando possível viés geográfico.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Socioeconomic Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Análise por Status Socioeconômico</CardTitle>
                <CardDescription>
                  Taxa de Falsos Positivos (FPR) e Score Médio por grupo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={socioeconomicData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="status" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      domain={[0, 10]}
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 0.5]}
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="avgRisk" 
                      fill="hsl(var(--primary))" 
                      name="Score Médio"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="fpr" 
                      fill="hsl(var(--factor-negative))" 
                      name="Taxa Falsos Positivos"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Drift Alert */}
            <Alert className="border-factor-negative bg-factor-negative/10">
              <TrendingUp className="h-5 w-5 text-factor-negative" />
              <AlertTitle className="text-factor-negative font-bold">
                Desvio (Drift) Detectado no Modelo
              </AlertTitle>
              <AlertDescription className="space-y-4 mt-3">
                <p className="text-sm">
                  <span className="font-semibold">Análise temporal:</span> Nos últimos 6 meses, 
                  a correlação entre o fator <span className="font-semibold">"Nível de Instrução"</span> e 
                  o risco predito aumentou em <span className="font-semibold text-factor-negative">24%</span>, 
                  indicando um possível drift nos dados de treinamento ou mudança no padrão populacional.
                </p>
                
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={driftData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      domain={[0.4, 0.55]}
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="correlation" 
                      stroke="hsl(var(--factor-negative))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--factor-negative))', r: 5 }}
                      name="Correlação"
                    />
                  </LineChart>
                </ResponsiveContainer>

                <Button className="bg-factor-negative hover:bg-factor-negative/90">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-validar Modelo
                </Button>
              </AlertDescription>
            </Alert>
          </div>

          {/* Right Column - Transparency */}
          <div className="space-y-6">
            {/* Excluded Variables */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Variáveis Excluídas
                </CardTitle>
                <CardDescription>
                  Por política de equidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-confidence-high mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    As seguintes variáveis foram <span className="font-semibold text-foreground">
                    explicitamente excluídas</span> do módulo preditivo para garantir a equidade 
                    e conformidade com direitos fundamentais:
                  </p>
                </div>

                <div className="space-y-2">
                  {excludedVariables.map((variable, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <Shield className="h-4 w-4 text-confidence-high flex-shrink-0" />
                      <span className="text-sm font-medium">{variable}</span>
                    </div>
                  ))}
                </div>

                <Alert className="border-confidence-high bg-confidence-high/10">
                  <CheckCircle2 className="h-4 w-4 text-confidence-high" />
                  <AlertDescription className="text-xs">
                    Todas as variáveis excluídas são auditadas mensalmente para garantir 
                    que não sejam introduzidas indiretamente via proxies.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Casos analisados</span>
                    <span className="text-lg font-bold">1,181</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Última auditoria</span>
                    <span className="text-sm font-semibold">15/11/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Versão do modelo</span>
                    <Badge variant="outline">v2.3.1</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Acurácia global</span>
                    <span className="text-lg font-bold text-confidence-high">87.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FairnessAudit;
