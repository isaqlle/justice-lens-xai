import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ShapForcePlot } from "@/components/ShapForcePlot";
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  TrendingUp,
  TrendingDown,
  FileText,
  Shield
} from "lucide-react";

const CaseDetail = () => {
  const { id } = useParams();
  const [simulationFactors, setSimulationFactors] = useState({
    employment: false,
    rehabilitation: false,
    communityTies: false,
  });

  // Mock data - in real app would fetch based on id
  const caseData = {
    id: id || "2024-001",
    defendant: "João Silva",
    age: 28,
    riskScore: 6.5,
    confidence: 85,
    riskLevel: "medium-high",
  };

  const factors = [
    {
      name: "Histórico de crimes violentos",
      impact: 45,
      type: "negative" as const,
      description: "3 ocorrências registradas",
      verified: true,
    },
    {
      name: "Idade na primeira infração",
      impact: 20,
      type: "negative" as const,
      description: "16 anos - fator de risco conhecido",
      verified: true,
    },
    {
      name: "Falta de vínculo empregatício formal",
      impact: 10,
      type: "negative" as const,
      description: "Sem registro em carteira nos últimos 2 anos",
      verified: true,
    },
    {
      name: "Vínculos comunitários",
      impact: -15,
      type: "positive" as const,
      description: "Comprovados por 2 declarações",
      verified: true,
    },
    {
      name: "Participação em programas de reabilitação",
      impact: -10,
      type: "positive" as const,
      description: "Programa concluído em 2023",
      verified: true,
    },
  ];

  // SHAP factors for detailed analysis
  const shapFactors = [
    { name: "Histórico de crimes violentos", shapValue: 2.3, type: "positive" as const, description: "3 ocorrências", isBiasProxy: false },
    { name: "Idade na primeira infração", shapValue: 1.2, type: "positive" as const, description: "16 anos", isBiasProxy: false },
    { name: "CEP de residência", shapValue: 0.5, type: "positive" as const, description: "Zona de alta criminalidade", isBiasProxy: true },
    { name: "Falta de emprego formal", shapValue: 0.8, type: "positive" as const, description: "Desempregado 2 anos", isBiasProxy: false },
    { name: "Vínculos comunitários", shapValue: -1.0, type: "negative" as const, description: "2 declarações", isBiasProxy: false },
    { name: "Programas de reabilitação", shapValue: -0.7, type: "negative" as const, description: "Concluído 2023", isBiasProxy: false },
    { name: "Tempo desde última infração", shapValue: -0.3, type: "negative" as const, description: "18 meses", isBiasProxy: false },
    { name: "Histórico de uso de substâncias", shapValue: 0.6, type: "positive" as const, description: "Tratamento em andamento", isBiasProxy: false },
  ];

  const [excludedShapFactors, setExcludedShapFactors] = useState<string[]>([]);

  const calculateSimulatedScore = () => {
    let adjustment = 0;
    if (simulationFactors.employment) adjustment -= 1.2;
    if (simulationFactors.rehabilitation) adjustment -= 0.8;
    if (simulationFactors.communityTies) adjustment -= 0.5;
    
    // Adjust for excluded SHAP factors
    excludedShapFactors.forEach(factorName => {
      const factor = shapFactors.find(f => f.name === factorName);
      if (factor) {
        adjustment -= factor.shapValue;
      }
    });
    
    return Math.max(0, Math.min(10, caseData.riskScore + adjustment));
  };

  const simulatedScore = calculateSimulatedScore();
  const hasSimulation = Object.values(simulationFactors).some(v => v) || excludedShapFactors.length > 0;

  const handleShapRecalculate = (excluded: string[]) => {
    setExcludedShapFactors(excluded);
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
              <h1 className="text-2xl font-bold text-foreground">{caseData.defendant}</h1>
              <p className="text-sm text-muted-foreground">Caso {caseData.id} - Análise Detalhada XAI</p>
            </div>
            <div className="flex gap-2">
              <Link to="/fairness-audit">
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Auditoria de Viés
                </Button>
              </Link>
              <Link to={`/report/${caseData.id}`}>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Risk Score Card */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliação de Risco de Reincidência</CardTitle>
                <CardDescription>Score explicado com nível de confiança</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-bold text-risk-medium">
                        {caseData.riskScore}
                      </span>
                      <span className="text-2xl text-muted-foreground">/10</span>
                    </div>
                    <Badge className="bg-risk-medium text-white text-base">
                      Risco Médio-Alto
                    </Badge>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="text-sm text-muted-foreground">Nível de Confiança</div>
                    <div className="flex items-center gap-2">
                      <Progress value={caseData.confidence} className="w-32" />
                      <span className="text-2xl font-bold text-confidence-high">
                        {caseData.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Alta confiança na previsão
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">Comparação Anônima</p>
                      <p className="text-sm text-muted-foreground">
                        Este score está <span className="font-semibold text-foreground">30% acima da média</span> para 
                        réus com histórico similar, independentemente de dados demográficos (raça, gênero, origem).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Factors Card */}
            <Card>
              <CardHeader>
                <CardTitle>Fatores-Chave da Avaliação</CardTitle>
                <CardDescription>Como cada fator contribuiu para o score final</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {factors.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {factor.type === "positive" ? (
                          <TrendingDown className="h-5 w-5 text-factor-positive flex-shrink-0" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-factor-negative flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{factor.name}</p>
                          <p className="text-xs text-muted-foreground">{factor.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {factor.verified && (
                          <CheckCircle2 className="h-4 w-4 text-confidence-high" />
                        )}
                        <Badge 
                          className={factor.type === "positive" 
                            ? "bg-factor-positive text-white" 
                            : "bg-factor-negative text-white"
                          }
                        >
                          {factor.impact > 0 ? '+' : ''}{factor.impact}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={Math.abs(factor.impact)} 
                      className={factor.type === "positive" ? "bg-factor-positive/20" : "bg-factor-negative/20"}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Bias Alert Card */}
            <Alert className="border-alert-bias bg-alert-bias/10">
              <AlertTriangle className="h-5 w-5 text-alert-bias" />
              <AlertTitle className="text-alert-bias font-bold">Alerta de Viés Proxy Detectado</AlertTitle>
              <AlertDescription className="space-y-3 mt-2">
                <p className="text-sm">
                  <span className="font-semibold">Atenção:</span> O modelo detectou que o fator 
                  <span className="font-semibold"> "CEP de residência"</span> (contribuição: +5%) 
                  possui uma correlação histórica elevada com viés racial em nossos dados de treinamento.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-alert-bias text-alert-bias">
                    <Shield className="h-4 w-4 mr-2" />
                    Recalcular sem este fator
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver análise completa de viés
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            {/* SHAP Force Plot */}
            <ShapForcePlot 
              factors={shapFactors}
              baseRisk={5.0}
              currentRisk={simulatedScore}
              onRecalculate={handleShapRecalculate}
            />

            {/* Data Transparency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Auditoria de Justiça (Fairness Check)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-confidence-high mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Verificação de Dados Demográficos</p>
                    <p className="text-sm text-muted-foreground">
                      Nenhum dado de raça, etnia ou gênero foi usado diretamente no cálculo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Fontes dos Dados</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Histórico criminal verificado em 10/11/2024 via Sistema Judicial Nacional</li>
                      <li>• Dados de emprego verificados em 08/11/2024 via Carteira de Trabalho Digital</li>
                      <li>• Vínculos comunitários verificados em 05/11/2024 via declarações notarizadas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Simulation */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Simulador de Decisão</CardTitle>
                <CardDescription>O que aconteceria se o réu...</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="employment"
                      checked={simulationFactors.employment}
                      onCheckedChange={(checked) => 
                        setSimulationFactors(prev => ({ ...prev, employment: checked as boolean }))
                      }
                    />
                    <label htmlFor="employment" className="text-sm font-medium cursor-pointer">
                      Tivesse emprego formal garantido?
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="rehabilitation"
                      checked={simulationFactors.rehabilitation}
                      onCheckedChange={(checked) => 
                        setSimulationFactors(prev => ({ ...prev, rehabilitation: checked as boolean }))
                      }
                    />
                    <label htmlFor="rehabilitation" className="text-sm font-medium cursor-pointer">
                      Fosse matriculado em programa de reabilitação?
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="communityTies"
                      checked={simulationFactors.communityTies}
                      onCheckedChange={(checked) => 
                        setSimulationFactors(prev => ({ ...prev, communityTies: checked as boolean }))
                      }
                    />
                    <label htmlFor="communityTies" className="text-sm font-medium cursor-pointer">
                      Fortalecesse vínculos comunitários?
                    </label>
                  </div>
                </div>

                {hasSimulation && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Score Simulado:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-factor-positive">
                            {simulatedScore.toFixed(1)}
                          </span>
                          <span className="text-lg text-muted-foreground">/10</span>
                        </div>
                      </div>
                      
                      <div className="bg-confidence-high/10 p-4 rounded-lg border border-confidence-high/20">
                        <p className="text-sm font-semibold text-confidence-high mb-2">
                          Novo Nível: {simulatedScore < 4 ? "Baixo" : simulatedScore < 7 ? "Médio" : "Alto"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Redução de {(caseData.riskScore - simulatedScore).toFixed(1)} pontos
                          ({Math.round(((caseData.riskScore - simulatedScore) / caseData.riskScore) * 100)}% de melhoria)
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <Button className="w-full" disabled={!hasSimulation}>
                  Gerar Relatório da Simulação
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;
