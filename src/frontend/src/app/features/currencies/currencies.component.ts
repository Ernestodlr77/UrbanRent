import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UN_MEMBER_COUNTRIES } from '../../core/data/world-countries';

interface CurrencyRow {
  code: string;
  name: string;
  countries: number;
  rate: number;
}

@Component({
  selector:'app-currencies',
  standalone:true,
  imports:[CommonModule,DecimalPipe],
  template:`
  <section class="currency-page">
    <div class="currency-head"><div><p class="eyebrow">MERCADO INTERNACIONAL</p><h1>Monedas</h1><p>{{filteredCurrencies.length}} monedas utilizadas por los 193 Estados miembros.</p></div><button class="currency-button primary" type="button" (click)="refreshRates()">Actualizar tasas</button></div>
    <div class="converter currency-card"><div><h2>Conversor</h2><p>Compara importes entre monedas.</p></div><div class="converter-controls"><input type="number" min="0" [value]="amount" (input)="amount=+$any($event.target).value"><select [value]="fromCode" (change)="fromCode=$any($event.target).value"><option *ngFor="let c of currencies" [value]="c.code">{{c.code}}</option></select><span>→</span><select [value]="toCode" (change)="toCode=$any($event.target).value"><option *ngFor="let c of currencies" [value]="c.code">{{c.code}}</option></select><strong>{{convertedAmount|number:'1.2-2'}} {{toCode}}</strong></div></div>
    <div class="currency-toolbar"><input class="currency-search" placeholder="Buscar moneda o país..." [value]="searchTerm" (input)="searchTerm=$any($event.target).value"><label>Moneda base <select [value]="baseCurrency" (change)="baseCurrency=$any($event.target).value"><option *ngFor="let c of currencies" [value]="c.code">{{c.code}}</option></select></label><span>Actualizado: {{updatedAt}}</span></div>
    <div class="currency-table-card currency-card"><table><thead><tr><th>MONEDA</th><th>PAÍSES</th><th>POR 1 USD</th><th>VALOR EN {{baseCurrency}}</th></tr></thead><tbody><tr *ngFor="let c of filteredCurrencies"><td><b>{{c.code}}</b><small>{{c.name}}</small></td><td>{{c.countries}}</td><td>{{c.rate|number:'1.2-4'}}</td><td>{{valueInBase(c)|number:'1.2-4'}} {{baseCurrency}}</td></tr><tr *ngIf="!filteredCurrencies.length"><td colspan="4" class="empty">Sin resultados.</td></tr></tbody></table></div>
    <div class="currency-note"><b>Nota:</b> las tasas son referenciales. La fuente pública se consulta al actualizar y puede variar.</div>
  </section>`,
  styles:[`:host{display:block}.currency-page{padding:24px;background:#f2f4f2;min-height:100%;color:#14231c}.currency-head,.currency-toolbar{display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap}.eyebrow{margin:0;color:#2b7a53;font-size:10px;font-weight:700;letter-spacing:1px}h1{margin:4px 0;font-size:28px}h2{margin:0 0 4px;font-size:17px}p,.currency-toolbar span,td small{color:#6b7872;font-size:12px}.currency-button{border:1px solid #dce5df;border-radius:8px;padding:9px 14px;cursor:pointer;font:inherit;font-weight:600}.primary{background:#2b7a53;color:#fff;border-color:#2b7a53}.currency-card{background:#fff;border:1px solid #e4e8e5;border-radius:12px}.converter{display:grid;grid-template-columns:.7fr 2fr;gap:20px;align-items:center;margin:22px 0 14px;padding:16px}.converter-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.converter-controls input,input,select{padding:8px 10px;border:1px solid #dce5df;border-radius:7px;background:#fff;color:#14231c;font:inherit}.converter-controls input{width:120px}.converter-controls strong{margin-left:auto;color:#2b7a53;font-size:20px}.currency-toolbar{margin-bottom:14px;padding:12px 14px;background:#fff;border:1px solid #e4e8e5;border-radius:10px}.currency-search{width:280px;max-width:100%}.currency-table-card{overflow:auto}.currency-table-card table{width:100%;border-collapse:collapse;font-size:13px}.currency-table-card th{padding:11px 14px;background:#f6f8f6;color:#6b7872;font-size:10px;text-align:left}.currency-table-card td{padding:12px 14px;border-bottom:1px solid #e4e8e5;white-space:nowrap}.currency-table-card td small{display:block;margin-top:3px;font-size:11px}.empty{text-align:center;padding:25px;color:#6b7872}.currency-note{margin-top:14px;padding:12px;color:#6b7872;background:#f6f8f6;border-radius:8px;font-size:12px}@media(max-width:760px){.currency-page{padding:16px}.converter{grid-template-columns:1fr}.converter-controls strong{margin-left:0}}`]
})
export class CurrenciesComponent implements OnInit {
  protected amount=100;
  protected fromCode='USD';
  protected toCode='GTQ';
  protected baseCurrency='GTQ';
  protected searchTerm='';
  protected updatedAt=new Date().toLocaleString('es-GT');
  protected currencies:CurrencyRow[]=this.buildCurrencies();

  ngOnInit(){this.refreshRates()}

  private buildCurrencies():CurrencyRow[]{
    const map=new Map<string,CurrencyRow>();
    let displayNames: Intl.DisplayNames|undefined;
    try{displayNames=new Intl.DisplayNames(['es'],{type:'currency'});}catch{}
    for(const country of UN_MEMBER_COUNTRIES){
      const code=country.currencyCode;
      if(!map.has(code)){
        map.set(code,{code,name:displayNames?.of(code)||`Moneda ${code}`,countries:0,rate:1});
      }
      map.get(code)!.countries++;
    }
    return [...map.values()].sort((a,b)=>a.code.localeCompare(b.code));
  }

  protected get filteredCurrencies(){
    const q=this.searchTerm.toLowerCase().trim();
    if(!q)return this.currencies;
    return this.currencies.filter(c=>`${c.code} ${c.name}`.toLowerCase().includes(q));
  }

  protected get convertedAmount(){
    const from=this.currencies.find(c=>c.code===this.fromCode)?.rate??1;
    const to=this.currencies.find(c=>c.code===this.toCode)?.rate??1;
    return this.amount/from*to;
  }

  protected valueInBase(currency:CurrencyRow){
    const base=this.currencies.find(c=>c.code===this.baseCurrency)?.rate??1;
    return currency.rate/base;
  }

  protected refreshRates(){
    this.updatedAt=new Date().toLocaleString('es-GT');
    fetch('https://open.er-api.com/v6/latest/USD').then(r=>r.json()).then(data=>{
      if(!data.rates)return;
      this.currencies=this.currencies.map(c=>({...c,rate:Number(data.rates[c.code]??c.rate)}));
      this.updatedAt=new Date().toLocaleString('es-GT');
    }).catch(()=>undefined);
  }
}
