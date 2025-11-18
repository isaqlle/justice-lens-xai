import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

const ReportExport = () => {
  const { id } = useParams();
  const [selectedSections, setSelectedSections] = useState({
    score: true,
    shap: true,
    bias: true,
    technical: true,
    fairness: false,
    simulation: false,
  });

  const caseData = {
    id: id || "2024-001",
    defendant: "João Silva",
    age: 28,
    riskScore: 6.5,
    confidence: 85,
    date: new Date().toLocaleDateString("pt-BR"),
    time: new Date().toLocaleTimeString("pt-BR"),
    judge: "Dr. Ana Costa",
    court: "2ª Vara Criminal - Comarca de São Paulo",
  };

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sections = [
    { id: "score", label: "Score Preditivo e Nível de Confiança", required: true },
    { id: "shap", label: "Visualização SHAP (Gráfico de Contribuição de Fatores)", required: true },
    { id: "bias", label: "Alerta de Viés Aplicado (com Simulação)", required: false },
    { id: "technical", label: "Descrição Técnica do Modelo (Algoritmo, Versão, Data)", required: true },
    { id: "fairness", label: "Métricas Globais de Fairness", required: false },
    { id: "simulation", label: "Simulações de Cenários Alternativos", required: false },
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
              <h1 className="text-2xl font-bold text-foreground">Exportação de Relatório XAI</h1>
              <p className="text-sm text-muted-foreground">Caso {caseData.id} - {caseData.defendant}</p>
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
                      <div className="bg-muted/30 p-6 rounded-lg border border-foreground/10">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-foreground/70 mb-2">Score Calculado</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-bold text-foreground">{caseData.riskScore}</span>
                              <span className="text-2xl text-foreground/50">/10</span>
                            </div>
                            <Badge className="mt-2 bg-foreground text-background">
                              Risco Médio-Alto
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
                          O score de {caseData.riskScore} indica um risco médio-alto de reincidência criminal. 
                          Este valor foi calculado com base em {caseData.confidence}% de confiança estatística, 
                          considerando múltiplos fatores objetivos validados pelo modelo preditivo.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SHAP Section */}
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

                  {/* Technical Section */}
                  {selectedSections.technical && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground border-b border-foreground/20 pb-2">
                        3. ESPECIFICAÇÕES TÉCNICAS DO MODELO
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

                  {/* Bias Alert Section */}
                  {selectedSections.bias && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground border-b border-foreground/20 pb-2">
                        4. ALERTAS DE VIÉS E AUDITORIA
                      </h3>
                      <div className="border-2 border-foreground/30 p-4 rounded-lg bg-muted/20">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                          <div className="space-y-2">
                            <p className="font-semibold text-foreground">Verificação de Equidade</p>
                            <p className="text-sm text-foreground/80">
                              Nenhum dado de raça, etnia, gênero ou religião foi utilizado diretamente 
                              no cálculo do score de risco. O sistema passou por auditoria de fairness 
                              em 15/11/2024 com resultado "Aceitável com Alertas".
                            </p>
                          </div>
                        </div>
                      </div>
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
