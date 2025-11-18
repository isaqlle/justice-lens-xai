import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface ShapFactor {
  name: string;
  shapValue: number;
  type: "positive" | "negative";
  description: string;
  isBiasProxy?: boolean;
}

interface ShapForcePlotProps {
  factors: ShapFactor[];
  baseRisk: number;
  currentRisk: number;
  onRecalculate?: (excludedFactors: string[]) => void;
}

export const ShapForcePlot = ({ 
  factors, 
  baseRisk, 
  currentRisk,
  onRecalculate 
}: ShapForcePlotProps) => {
  const [filterMode, setFilterMode] = useState<"top" | "all">("top");
  const [excludedFactors, setExcludedFactors] = useState<string[]>([]);

  const filteredFactors = filterMode === "top" 
    ? factors.slice(0, 5).filter(f => !excludedFactors.includes(f.name))
    : factors.filter(f => !excludedFactors.includes(f.name));

  const biasFactors = factors.filter(f => f.isBiasProxy);

  const maxAbsValue = Math.max(...factors.map(f => Math.abs(f.shapValue)));
  
  const getArrowWidth = (value: number) => {
    return (Math.abs(value) / maxAbsValue) * 100;
  };

  const handleExcludeFactor = (factorName: string) => {
    const newExcluded = [...excludedFactors, factorName];
    setExcludedFactors(newExcluded);
    if (onRecalculate) {
      onRecalculate(newExcluded);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contribuição SHAP Detalhada</CardTitle>
              <CardDescription>Visualização do impacto de cada fator no score final</CardDescription>
            </div>
            <Select value={filterMode} onValueChange={(v) => setFilterMode(v as "top" | "all")}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Mais Influentes</SelectItem>
                <SelectItem value="all">Todos os 30 Fatores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Force Plot Visualization */}
          <div className="relative py-8">
            {/* Base line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border" />
            
            {/* Base Risk Marker */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center">
                <div className="h-4 w-0.5 bg-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap mt-1">
                  Base: {baseRisk.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Current Risk Marker */}
            <div 
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${50 + ((currentRisk - baseRisk) / 10) * 50}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="h-6 w-1 bg-foreground rounded-full" />
                <span className="text-sm font-bold text-foreground whitespace-nowrap mt-1">
                  Score: {currentRisk.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Arrows for factors */}
            <div className="space-y-3 mt-16">
              {filteredFactors.map((factor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-48 text-right">
                    <p className="text-sm font-medium truncate">{factor.name}</p>
                    <p className="text-xs text-muted-foreground">{factor.description}</p>
                  </div>
                  
                  <div className="flex-1 flex items-center">
                    {factor.type === "positive" ? (
                      <div 
                        className="h-8 bg-gradient-to-r from-factor-negative/60 to-factor-negative rounded-r-lg flex items-center justify-end px-2 transition-all"
                        style={{ width: `${getArrowWidth(factor.shapValue)}%` }}
                      >
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div 
                        className="h-8 bg-gradient-to-l from-factor-positive/60 to-factor-positive rounded-l-lg flex items-center justify-start px-2 ml-auto transition-all"
                        style={{ width: `${getArrowWidth(factor.shapValue)}%` }}
                      >
                        <TrendingDown className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="w-24 text-left">
                    <span className={`text-sm font-bold ${
                      factor.type === "positive" ? "text-factor-negative" : "text-factor-positive"
                    }`}>
                      {factor.shapValue > 0 ? '+' : ''}{factor.shapValue.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bias Analysis */}
      {biasFactors.length > 0 && biasFactors.some(f => !excludedFactors.includes(f.name)) && (
        <Alert className="border-alert-bias bg-alert-bias/10">
          <AlertTriangle className="h-5 w-5 text-alert-bias" />
          <AlertTitle className="text-alert-bias font-bold">Análise SHAP: Viés Histórico de Localidade Detectado</AlertTitle>
          <AlertDescription className="space-y-4 mt-3">
            {biasFactors.filter(f => !excludedFactors.includes(f.name)).map((factor, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm">
                  O fator <span className="font-semibold">"{factor.name}"</span> contribuiu com{" "}
                  <span className="font-semibold">{Math.abs(factor.shapValue)}%</span> do risco. 
                  Analisando a distribuição de valores SHAP para este fator, 95% dos réus neste CEP 
                  têm contribuições positivas (aumento de risco), indicando um{" "}
                  <span className="font-semibold text-alert-bias">Viés Histórico de Localidade</span>.
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-alert-bias text-alert-bias hover:bg-alert-bias hover:text-white"
                    onClick={() => handleExcludeFactor(factor.name)}
                  >
                    Recalcular sem este fator
                  </Button>
                </div>
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {excludedFactors.length > 0 && (
        <Alert className="border-confidence-high bg-confidence-high/10">
          <AlertDescription>
            <p className="text-sm font-semibold">
              {excludedFactors.length} fator(es) excluído(s) da análise: {excludedFactors.join(", ")}
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
