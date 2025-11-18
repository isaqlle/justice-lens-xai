import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const cases = [
    {
      id: "2024-001",
      defendant: "João Silva",
      age: 28,
      riskLevel: "medium-high",
      riskScore: 6.5,
      confidence: 85,
      nextHearing: "2024-12-15",
      biasAlerts: 1,
    },
    {
      id: "2024-002",
      defendant: "Maria Santos",
      age: 35,
      riskLevel: "low",
      riskScore: 3.2,
      confidence: 92,
      nextHearing: "2024-12-18",
      biasAlerts: 0,
    },
    {
      id: "2024-003",
      defendant: "Carlos Oliveira",
      age: 42,
      riskLevel: "high",
      riskScore: 8.1,
      confidence: 78,
      nextHearing: "2024-12-20",
      biasAlerts: 2,
    },
  ];

  const getRiskBadge = (level: string) => {
    const config = {
      high: { label: "Alto", className: "bg-risk-high text-white" },
      "medium-high": { label: "Médio-Alto", className: "bg-risk-medium text-white" },
      medium: { label: "Médio", className: "bg-risk-medium text-white" },
      low: { label: "Baixo", className: "bg-risk-low text-white" },
    };
    const risk = config[level as keyof typeof config] || config.medium;
    return <Badge className={risk.className}>{risk.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel da Justiça Transparente</h1>
              <p className="text-sm text-muted-foreground">Sistema de Avaliação de Risco Explicável</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/fairness-audit">
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Auditoria de Viés
                </Button>
              </Link>
              <Badge variant="outline" className="text-sm">
                Juiz(a): Dr. Ana Costa
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Casos Ativos</CardDescription>
              <CardTitle className="text-3xl">24</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingDown className="h-4 w-4 text-factor-positive" />
                <span>-12% vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Alertas de Viés</CardDescription>
              <CardTitle className="text-3xl">3</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-alert-bias">
                <AlertTriangle className="h-4 w-4" />
                <span>Requer atenção</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Confiança Média</CardDescription>
              <CardTitle className="text-3xl">88%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-confidence-high">
                <TrendingUp className="h-4 w-4" />
                <span>Acima do padrão</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Audiências Hoje</CardDescription>
              <CardTitle className="text-3xl">5</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">3 pela manhã, 2 à tarde</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Casos em Andamento</CardTitle>
            <CardDescription>Clique em um caso para ver análise detalhada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome, número do caso..." className="pl-10" />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>

            {/* Cases List */}
            <div className="space-y-4">
              {cases.map((case_) => (
                <Link key={case_.id} to={`/case/${case_.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{case_.defendant}</h3>
                            <Badge variant="outline">{case_.age} anos</Badge>
                            <Badge variant="outline" className="font-mono">{case_.id}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Risco de Reincidência:</span>
                              {getRiskBadge(case_.riskLevel)}
                              <span className="font-mono font-semibold">{case_.riskScore}/10</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Confiança:</span>
                              <span className={`font-semibold ${
                                case_.confidence >= 85 ? 'text-confidence-high' :
                                case_.confidence >= 70 ? 'text-confidence-medium' :
                                'text-confidence-low'
                              }`}>
                                {case_.confidence}%
                              </span>
                            </div>
                            
                            {case_.biasAlerts > 0 && (
                              <div className="flex items-center gap-2 text-alert-bias">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-semibold">
                                  {case_.biasAlerts} alerta{case_.biasAlerts > 1 ? 's' : ''} de viés
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            Próxima audiência: {new Date(case_.nextHearing).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
