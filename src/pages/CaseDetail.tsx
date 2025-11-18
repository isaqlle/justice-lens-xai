import * as React from "react";
import { useState, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ArrowLeft,
  Check,
  ShieldAlert,
  Scale,
  Calendar,
  User,
  AlertTriangle,
  HelpCircle,
  FileText,
  Shield,
  Info
} from 'lucide-react';
import { ShapForcePlot } from '@/components/ShapForcePlot';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";

const BASE_RISK_SCORE = 4.0;
const BIAS_FACTOR_NAME = "CEP de residência";
const BIAS_SHAP_VALUE = 0.5;

// Mock Data
const mockCaseData = {
  id: '2024-001',
  defendant: 'João Silva',
  crime: 'Furto Qualificado',
  status: 'Pendente',
  // Score de risco inicial (Base do SHAP + contribuições mock)
  riskScore: BASE_RISK_SCORE + 2.3 + 1.2 - 1.0 - 0.7 + BIAS_SHAP_VALUE, // 6.3 + 0.5 = 6.8
  confidence: 85,
  judge: 'Dr. Ana Costa',
  court: '2ª Vara Criminal - SP',
  data: [
    { label: 'Histórico de Crimes Violentos', value: 'Sim', color: 'text-red-500' },
    { label: 'Idade', value: '28 anos', color: 'text-gray-700' },
    { label: 'Antecedentes Criminais', value: '3 registros', color: 'text-red-500' },
    { label: 'Vínculos Comunitários', value: 'Baixo', color: 'text-gray-700' },
    { label: 'Situação Empregatícia', value: 'Desempregado', color: 'text-red-500' },
    { label: 'Programa de Reabilitação', value: 'Não', color: 'text-gray-700' },
    { label: BIAS_FACTOR_NAME, value: '08000-000', color: 'text-red-500' },
  ],
};

const shapFactors = [
  { name: 'Histórico de crimes violentos', shapValue: 2.3, type: "positive" as const, description: "3 ocorrências", isBiasProxy: false },
  { name: 'Idade na primeira infração', shapValue: 1.2, type: "positive" as const, description: "16 anos", isBiasProxy: false },
  { name: 'Vínculos comunitários', shapValue: -1.0, type: "negative" as const, description: "2 declarações", isBiasProxy: false },
  { name: 'Programas de reabilitação', shapValue: -0.7, type: "negative" as const, description: "Concluído 2023", isBiasProxy: false },
  { name: BIAS_FACTOR_NAME, shapValue: BIAS_SHAP_VALUE, type: "positive" as const, description: "Zona de alta criminalidade", isBiasProxy: true }, 
];

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(mockCaseData);
  const [isBiasMitigated, setIsBiasMitigated] = useState(false);

  // Calcula o score mitigado removendo o valor SHAP do fator de viés
  const currentRiskScore = isBiasMitigated 
    ? caseData.riskScore - BIAS_SHAP_VALUE
    : caseData.riskScore;

  const getRiskLevel = (score: number) => {
    if (score < 4) return { label: 'Baixo', color: 'bg-risk-low' };
    if (score < 7) return { label: 'Médio', color: 'bg-risk-medium' };
    return { label: 'Alto', color: 'bg-risk-high' };
  };

  const currentRiskLevel = getRiskLevel(currentRiskScore);
  
  // Fatores para o ShapForcePlot (com ou sem o CEP)
  const filteredShapFactors = useMemo(() => {
    return isBiasMitigated 
      ? shapFactors.filter(f => f.name !== BIAS_FACTOR_NAME)
      : shapFactors;
  }, [isBiasMitigated]);

  const handleMitigateBias = useCallback(() => {
    // Ação principal de mitigação
    setIsBiasMitigated(prev => !prev);
    
    const action = !isBiasMitigated ? 'Anulação Ética Aplicada' : 'Anulação Ética Removida';
    const newScore = !isBiasMitigated ? (caseData.riskScore - BIAS_SHAP_VALUE).toFixed(1) : caseData.riskScore.toFixed(1);

    toast.success(action, {
      description: `O fator "${BIAS_FACTOR_NAME}" foi ${!isBiasMitigated ? 'anulado' : 'reincluído'}. Novo Score: ${newScore}.`,
    });
  }, [isBiasMitigated, caseData.riskScore]);

  const handleGenerateSimulationReport = () => {
    // Navega para a página de relatório, passando o score mitigado como parâmetro
    const url = `/report/${caseData.id}?simulatedScore=${currentRiskScore.toFixed(1)}&isSimulation=true`;
    navigate(url);
  };
  
  // CORREÇÃO 2: Função para voltar à página anterior (Dashboard)
  const handleGoBack = () => {
    navigate(-1); 
  };
  
  // Atualiza os campos de dados para mostrar o status da mitigação
  const dataFields = useMemo(() => {
    return mockCaseData.data.map(item => {
      if (item.label === BIAS_FACTOR_NAME) {
        return {
          ...item,
          value: isBiasMitigated ? 'ANULADO (Mitigação Racial)' : item.value,
          color: isBiasMitigated ? 'text-confidence-high' : 'text-red-500',
        };
      }
      return item;
    });
  }, [isBiasMitigated]);


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* CORREÇÃO 2: Usa handleGoBack para navegação robusta */}
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Análise de Caso: {caseData.defendant}
              </h1>
              <p className="text-sm text-muted-foreground">
                ID do Processo: {caseData.id} | Crime: {caseData.crime}
              </p>
            </div>
            <Link to={`/report/${id}`}>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Exportar Relatório Base
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Coluna 1: Score e Alerta */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Score de Risco de Reincidência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={cn(
                      'text-7xl font-extrabold p-8 rounded-full border-4',
                      currentRiskLevel.color.replace('bg-', 'border-'),
                      currentRiskLevel.color.replace('bg-', 'text-'),
                      'w-32 h-32 flex items-center justify-center'
                    )}
                  >
                    {currentRiskScore.toFixed(1)}
                  </div>
                  <Badge className={cn('mt-4 text-white text-base', currentRiskLevel.color)}>
                    Risco {currentRiskLevel.label}
                    {isBiasMitigated && <span className="ml-2 font-normal">(Mitigado)</span>}
                  </Badge>
                </div>
                {isBiasMitigated && (
                  <Alert className="border-confidence-high bg-confidence-high/10">
                    <Info className="h-4 w-4 text-confidence-high" />
                    <AlertDescription className="text-sm">
                      <span className="font-bold">Score Simulado:</span> {currentRiskScore.toFixed(1)} (redução de {(caseData.riskScore - currentRiskScore).toFixed(1)} pontos após Anulação Ética).
                    </AlertDescription>
                  </Alert>
                )}
                <div className="text-center text-sm text-muted-foreground">
                  <p>Confiança do Modelo: {caseData.confidence}%</p>
                  <p className="flex items-center justify-center pt-2">
                    <Scale className="h-4 w-4 mr-1" /> Juízo: {caseData.judge}
                  </p>
                  <p className="flex items-center justify-center">
                    <Calendar className="h-4 w-4 mr-1" /> Data da Avaliação: {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Alerta de Viés Algorítmico (Foco Disciplinar) */}
            <Card className="shadow-lg border-2 border-alert-bias/50">
              <CardContent className="p-4">
                <Alert className="border-alert-bias bg-alert-bias/10">
                  <AlertTriangle className="h-5 w-5 text-alert-bias" />
                  <AlertTitle className="text-alert-bias font-bold">
                    Alerta de **Racismo Algorítmico** (Viés Racial)
                  </AlertTitle>
                  <AlertDescription className="space-y-3 mt-2">
                    <p className="text-sm">
                      <span className="font-semibold">Atenção:</span> A análise **SHAP** indica que o fator 
                      <span className="font-semibold"> "{BIAS_FACTOR_NAME}"</span> (contribuição de **{BIAS_SHAP_VALUE.toFixed(1)}%**) 
                      exerceu um peso desproporcional. Este fator é um proxy conhecido para <span className="font-bold">discriminação e viés racial</span>. 
                      O SAJE recomenda uma **Anulação Ética** de sua influência no score.
                    </p>
                    {/* CORREÇÃO 1: Adicionado justify-between e ajustado classes de layout */}
                    <div className="flex justify-between items-center space-x-2"> 
                      <Button 
                          variant="secondary" 
                          onClick={handleMitigateBias}
                          className={cn("flex-1", isBiasMitigated ? "bg-confidence-high hover:bg-confidence-high/90 text-white" : "bg-alert-bias hover:bg-alert-bias/90 text-white")}
                      >
                          {isBiasMitigated ? <Check className="h-4 w-4 mr-2" /> : <ShieldAlert className="h-4 w-4 mr-2" />}
                          {isBiasMitigated ? 'Viés Mitigado' : 'Mitigar Viés'}
                      </Button>
                      <Button 
                        variant="default"
                        disabled={!isBiasMitigated}
                        onClick={handleGenerateSimulationReport}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                          Gerar Relatório
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Fatores do Caso */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Dados de Entrada</CardTitle>
                <CardDescription>Fatores objetivos do processo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataFields.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-muted-foreground">{item.label}</span>
                      <Badge className={cn('font-semibold', item.color.includes('red') ? 'bg-red-100 text-red-600 hover:bg-red-100' : item.color.includes('high') ? 'bg-confidence-high/20 text-confidence-high hover:bg-confidence-high/20' : 'bg-gray-100 text-gray-800 hover:bg-gray-100')}>
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2 e 3: Explicação XAI e Auditoria */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="xai">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="xai">Inteligência Artificial Explicável (XAI/SHAP)</TabsTrigger>
                <TabsTrigger value="audit">Auditoria de Fairness (Visão Global)</TabsTrigger>
              </TabsList>
              
              {/* XAI/SHAP Tab (Explicação Local) */}
              <TabsContent value="xai">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Contribuição SHAP Detalhada (Force Plot)</CardTitle>
                    <CardDescription>
                      Quantificação local do peso de cada variável no score final.
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="link" size="sm" className="ml-1 h-auto p-0 text-xs">
                            O que é SHAP?
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 text-sm">
                          O SHAP calcula a contribuição de cada variável para a previsão final do modelo, 
                          movendo a IA da "caixa-preta" para a "caixa de vidro". Fatores positivos (seta para cima/vermelha) aumentam o risco.
                        </PopoverContent>
                      </Popover>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-80">
                    <ShapForcePlot 
                      factors={filteredShapFactors} 
                      baseRisk={BASE_RISK_SCORE} 
                      currentRisk={currentRiskScore} 
                      onRecalculate={() => {}}
                    />
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground mt-4">
                      <span className="font-semibold">Resultado da Explicabilidade:</span> O score final de 
                      <span className="font-bold text-foreground"> {currentRiskScore.toFixed(1)}</span> é a soma do score base ({BASE_RISK_SCORE.toFixed(1)}) 
                      com as contribuições de todos os fatores listados.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Auditoria Tab (Visão Global) */}
              <TabsContent value="audit">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Auditoria Global de Equidade</CardTitle>
                    <CardDescription>
                      Análise do desempenho do modelo em diferentes grupos protegidos (foco em Viés Racial).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Scale className="h-4 w-4 text-primary" /> Avaliação de Viés Racial
                      </h4>
                      <p className="text-muted-foreground">
                        Nossos testes (Difference in Equal Opportunity, Equal Accuracy) indicam que a diferença de acerto entre o **grupo não-branco** e o **grupo branco**
                        está ligeiramente acima do limite aceitável (tolerância de 5% violada em 7.2%). Esta disparidade é a origem do Alerta de Viés Algorítmico.
                      </p>
                      <Link to="/fairness-audit">
                        <Button variant="link" className="p-0 h-auto mt-2">
                          Ver Métricas de Fairness Detalhadas
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Exemplo de outras métricas */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 border rounded-lg bg-secondary/10">
                        <p className="font-semibold">Equal Opportunity Difference</p>
                        <p className="text-red-600 font-bold">7.2% (Violação)</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-secondary/10">
                        <p className="font-semibold">Demographic Parity</p>
                        <p className="text-green-600 font-bold">2.1% (Aceitável)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;