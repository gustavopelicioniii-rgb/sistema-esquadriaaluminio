import { vidroTypologies } from '@/components/tipologias/vidro-svgs';

const CatalogoVidros = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Catálogo de Tipologias de Vidro</h1>
      <p className="text-muted-foreground text-sm">Padrões de divisão do plano de vidro</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {vidroTypologies.map(({ id, label, Icon }) => (
        <div
          key={id}
          className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 shadow-sm"
        >
          <div className="w-24 h-24">
            <Icon />
          </div>
          <span className="text-xs font-medium text-center text-foreground">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CatalogoVidros;
