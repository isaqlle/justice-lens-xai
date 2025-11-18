import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { 
  ArrowLeft, 
  Download, 
  FileText,
  Shield,
  CheckCircle2,
  Calendar,
  User,
  Scale,
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils"; 

const ReportExport = () => {
  const { id } = useParams();
  const location = useLocation(); 
  const searchParams = new URLSearchParams(location.search);
  const simulatedScoreParam = searchParams.get('simulatedScore');
  
  // Determine if it's a simulation report
  const isSimulation = !!simulatedScoreParam && searchParams.get('isSimulation') === 'true';

  const [selectedSections, setSelectedSections] = useState({
    score: true,
    shap: true,
    bias: true,
    technical: true,
    fairness: false,
    simulation: isSimulation, 
  });

  // Base mock data (Default riskScore is 6.5)
  const baseRiskScore = 6.5;

  // Use the simulated score if available, otherwise use the default risk score
  const currentRiskScore = simulatedScoreParam ? parseFloat(simulatedScoreParam) : baseRiskScore;

  const baseCaseData = {
    id: id || "2024-001",
    defendant: "João Silva",
    age: 28,
    riskScore: currentRiskScore,
    confidence: 85, 
    date: new Date().toLocaleDateString("pt-BR"),
    time: new Date().toLocaleTimeString("pt-BR"),
    judge: "Dr. Ana Costa",
    court: "2ª Vara Criminal - Comarca de São Paulo",
  };
  
  const caseData = baseCaseData;

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getRiskLevel = (score: number) => {
    if (score < 4) return { label: "Baixo", color: "bg-risk-low" };
    if (score < 7) return { label: "Médio", color: "bg-risk-medium" };
    return { label: "Alto", color: "bg-risk-high" };
  }
  
  const currentRiskLevel = getRiskLevel(caseData.riskScore);

  const sections = [
    { id: "score", label: "Score Preditivo e Nível de Confiança", required: true },
    { id: "shap", label: "Visualização SHAP (Gráfico de Contribuição de Fatores)", required: true },
    { id: "bias", label: "Alerta de Viés Aplicado", required: false },
    { id: "technical", label: "Descrição Técnica do Modelo (Algoritmo, Versão, Data)", required: true },
    { id: "fairness", label: "Métricas Globais de Fairness", required: false },
    { id: "simulation", label: "Simulações de Cenários Alternativos (Cenário " + (isSimulation ? "Mitigação de Racismo Algorítmico)" : "Base)"), required: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to={`/case/${id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Exportação de Relatório XAI 
                {isSimulation && <Badge className="ml-2 bg-primary/20 text-primary">Simulação</Badge>}
              </h1>
              <p className="text-sm text-muted-foreground">
                Caso {caseData.id} - {caseData.defendant} 
                {isSimulation && <span className="font-semibold text-alert-bias ml-2">(Cenário Simulado de Mitigação de Racismo Algorítmico)</span>}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Relatório</CardTitle>
                <CardDescription>Selecione as seções a incluir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={section.id}
                      checked={selectedSections[section.id as keyof typeof selectedSections]}
                      onCheckedChange={() => toggleSection(section.id as keyof typeof selectedSections)}
                      disabled={section.required}
                    />
                    <label
                      htmlFor={section.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {section.label}
                      {section.required && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Obrigatório
                        </Badge>
                      )}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Visualizar Prévia Completa
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Report Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-0">
                {/* Document Preview */}
                <div className="bg-white text-foreground p-12 space-y-8">
                  {/* Header */}
                  <div className="border-b-2 border-foreground pb-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Shield className="h-8 w-8 text-foreground" />
                          <div>
                            <h2 className="text-2xl font-bold text-foreground">
                              SAJE
                            </h2>
                            <p className="text-sm text-foreground/70">
                              Sistema de Avaliação Judicial Explicável
                              {isSimulation && " (Relatório de Simulação de Contestação)"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm space-y-1">
                        <p className="font-semibold text-foreground">Relatório XAI</p>
                        <p className="text-foreground/70">Documento Oficial</p>
                        <p className="text-foreground/70">Nº {caseData.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Case Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground border-b border-foreground/20 pb-2">
                      INFORMAÇÕES DO CASO
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-foreground/70 font-semibold flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Réu
                        </p>
                        <p className="text-foreground pl-6">{caseData.defendant}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground/70 font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Data de Emissão
                        </p>
                        <p className="text-foreground pl-6">{caseData.date} - {caseData.time}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground/70 font-semibold flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          Juízo
                        </p>
                        <p className="text-foreground pl-6">{caseData.judge}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground/70 font-semibold">Comarca</p>
                        <p className="text-foreground pl-6">{caseData.court}</p>
                      </div>
                    </div>
                  </div>

                  {/* Score Section */}
                  {selectedSections.score && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground border-b border-foreground/20 pb-2">
                        1. AVALIAÇÃO DE RISCO DE REINCIDÊNCIA
                      </h3>
                      {isSimulation && (
                         <Alert className="border-alert-bias bg-alert-bias/10">
                           <Shield className="h-5 w-5 text-alert-bias" />
                           <AlertTitle className="text-alert-bias font-bold">CENÁRIO SIMULADO (Mitigação de Racismo Algorítmico)</AlertTitle>
                           <AlertDescription className="text-sm">
                             Este score reflete uma análise hipotética após a aplicação de ações corretivas, especificamente a <span className="font-semibold">Anulação Ética</span> de fatores de viés proxy (ex: CEP de residência) com alta correlação com o <span className="font-bold">viés racial</span>, para fins de auditoria de equidade e contestação.
                           </AlertDescription>
                         </Alert>
                      )}
                      <div className="bg-muted/30 p-6 rounded-lg border border-foreground/10">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-foreground/70 mb-2">Score Calculado</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-bold text-foreground">{caseData.riskScore.toFixed(1)}</span>
                              <span className="text-2xl text-foreground/50">/10</span>
                            </div>
                            <Badge className={cn("mt-2 text-white", currentRiskLevel.color)}>
                              Risco {currentRiskLevel.label}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-foreground/70 mb-2">Nível de Confiança</p>
                            <p className="text-4xl font-bold text-foreground">{caseData.confidence}%</p>
                            <p className="text-xs text-foreground/70 mt-2">Alta confiança</p>
                          </div>
                        </div>
                        <Separator className="my-4 bg-foreground/10" />
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          O score de **{caseData.riskScore.toFixed(1)}** indica um risco **{currentRiskLevel.label.toLowerCase()}** de reincidência criminal. 
                          {isSimulation && " Este valor foi recalculado com base em um cenário de mitigação simulado, evidenciando o impacto do viés racial no score original."}
                          {!isSimulation && ` Este valor foi calculado com base em ${caseData.confidence}% de confiança estatística, considerando múltiplos fatores objetivos validados pelo modelo preditivo.`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SHAP Section (mantido neutro, pois é a técnica) */}
                  {selectedSections.shap && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground border-b border-foreground/20 pb-2">
                        2. ANÁLISE DE FATORES (SHAP)
                      </h3>
                      <table className="w-full text-sm border border-foreground/20">
                        <thead className="bg-muted/30">
                          <tr>
                            <th className="text-left p-3 font-semibold text-foreground border-b border-foreground/20">
                              Fator
                            </th>
                            <th className="text-right p-3 font-semibold text-foreground border-b border-foreground/20">
                              Contribuição
                            </th>
                            <th className="text-center p-3 font-semibold text-foreground border-b border-foreground/20">
                              Impacto
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-foreground/10">
                            <td className="p-3 text-foreground">Histórico de crimes violentos</td>
                            <td className="text-right p-3 font-bold text-foreground">+2.3</td>
                            <td className="text-center p-3">
                              <Badge variant="outline" className="border-foreground/20">Negativo</Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-foreground/10">
                            <td className="p-3 text-foreground">Idade na primeira infração</td>
                            <td className="text-right p-3 font-bold text-foreground">+1.2</td>
                            <td className="text-center p-3">
                              <Badge variant="outline" className="border-foreground/20">Negativo</Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-foreground/10">
                            <td className="p-3 text-foreground">Vínculos comunitários</td>
                            <td className="text-right p-3 font-bold text-foreground">-1.0</td>
                            <td className="text-center p-3">
                              <Badge variant="outline" className="border-foreground/20">Positivo</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 text-foreground">Programas de reabilitação</td>
                            <td className="text-right p-3 font-bold text-foreground">-0.7</td>
                            <td className="text-center p-3">
                              <Badge variant="outline" className="border-foreground/20">Positivo</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Technical Section (mantido neutro) */}
                  {selectedSections.technical && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground border-b border-foreground/20 pb-2">
                        {selectedSections.shap ? "3. " : "2. "}ESPECIFICAÇÕES TÉCNICAS DO MODELO
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground/70">Algoritmo Base</p>
                          <p className="text-foreground">Gradient Boosting Classifier (XGBoost)</p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground/70">Versão do Modelo</p>
                          <p className="text-foreground">v2.3.1</p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground/70">Data de Treinamento</p>
                          <p className="text-foreground">15/10/2024</p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground/70">Dataset</p>
                          <p className="text-foreground">23,847 casos históricos (2019-2024)</p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground/70">Acurácia Validada</p>
                          <p className="text-foreground">87.3% (validação cruzada 10-fold)</p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground/70">Método de Explicabilidade</p>
                          <p className="text-foreground">SHAP (SHapley Additive exPlanations)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bias Alert Section (adaptado) */}
                  {selectedSections.bias && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground border-b border-foreground/20 pb-2">
                        {selectedSections.shap ? "4. " : "3. "}ALERTAS DE VIÉS E AUDITORIA
                      </h3>
                      <div className="border-2 border-foreground/30 p-4 rounded-lg bg-muted/20">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                          <div className="space-y-2">
                            <p className="font-semibold text-foreground">Verificação de Equidade Racial</p>
                            <p className="text-sm text-foreground/80">
                              O sistema SAJE monitora ativamente fatores proxy. O modelo passou por auditoria de fairness racial em 15/11/2024 com resultado "Aceitável com Alertas" (Viés na Métrica de Igualdade de Oportunidade).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Simulation Section (com foco em Equidade Racial) */}
                  {selectedSections.simulation && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground border-b border-foreground/20 pb-2">
                        {sections.find(s => s.id === 'simulation')?.label}
                      </h3>
                      <Alert className="border-confidence-high bg-confidence-high/10">
                        <CheckCircle2 className="h-5 w-5 text-confidence-high" />
                        <AlertTitle className="text-confidence-high font-bold">IMPACTO POSITIVO NA EQUIDADE RACIAL</AlertTitle>
                        <AlertDescription className="space-y-2 text-sm">
                          <p>
                            A simulação aplicada, baseada na <span className="font-semibold">Anulação Ética</span> do fator proxy ("CEP de residência") que contribui para o viés racial, resultou em uma 
                            redução de risco de **{(baseRiskScore - caseData.riskScore).toFixed(1)} pontos** (de {baseRiskScore.toFixed(1)} para {caseData.riskScore.toFixed(1)}).
                          </p>
                          <p>
                            Isto demonstra que a intervenção do profissional jurídico, suportada pela transparência XAI/SHAP, 
                            é eficaz para mitigar o <span className="font-semibold">Racismo Algorítmico</span>, alinhando-se ao princípio de Justiça do SAJE.
                          </p>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Certification Seal */}
                  <div className="border-t-2 border-foreground pt-6 mt-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Shield className="h-10 w-10 text-foreground" />
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              DOCUMENTO AUDITADO PELO SAJE
                            </p>
                            <p className="text-xs text-foreground/70">
                              Certificação XAI - Explicabilidade Verificada
                              {isSimulation && " (Simulação de Contestação)"}
                            </p>
                            <p className="text-xs text-foreground/70">
                              Emitido em: {caseData.date} às {caseData.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 className="h-4 w-4 text-foreground" />
                          <span className="text-xs text-foreground/70">
                            Hash de Verificação: SHA-256:a8f5f167f44f4964e6c998dee827110c
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <div className="w-24 h-24 border-2 border-foreground/30 rounded-lg flex items-center justify-center bg-muted/20">
                          <QrCode className="h-16 w-16 text-foreground/50" />
                        </div>
                        <p className="text-xs text-foreground/70">Verificar autenticidade</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-xs text-center text-foreground/50 pt-6 border-t border-foreground/10">
                    <p>
                      Este documento foi gerado automaticamente pelo Sistema de Avaliação Judicial Explicável (SAJE).
                    </p>
                    <p className="mt-1">
                      A reprodução deste documento é permitida apenas para fins judiciais oficiais.
                    </p>
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

export default ReportExport;