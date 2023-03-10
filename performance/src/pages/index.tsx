import { SearchResults } from "@/components/SearchResults";
import { FormEvent, useCallback, useState } from "react"

type Results = {
  totalPrice: number;
  data: any[];
}

export default function Home() {

  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Results>({
    totalPrice: 0,
    data: []
  });

  //formatar os dados apos recebe-los
  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    //se a minha busca nao estiver vazia, inclusive sem espacos vazios
    if(!search.trim()) {
      return;
    }

    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();

    //fazer a formatacao dos dados aqui pra nao fazer isso dentro do componente
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    //colocar esse products no setResults data
    const products = data.map((product: any) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        priceFormatted: formatter.format(product.price),
      };
    })

    const totalPrice = data.reduce((total: number, product: any) => {
      return total + product.price;
    }, 0)

    setResults({ totalPrice, data: products });
  }

  //verificar a questao de igualdade referencial aqui..
  const addToWishList = useCallback( async (id: number) => {
    console.log(id);
  }, [])

  return (
    <div>
      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <button type="submit">Buscar</button>
      </form>

      <SearchResults 
        results={results.data} 
        totalPrice={results.totalPrice} 
        onAddToWishList={addToWishList}
      />
    </div>
  )
}

// FLUXO DE RENDERIZACAO
/**
 * 1. criar uma nova versao do componente
 * 2. comparara com a versao anterior
 * 3. se houver alteracoes, atualizar o que alterou
 */

/**
 * O useMEmo serve para evitar que alguma coisa que ocupe mto processamento seja refeito toda vez que aquele componente renderizar
 */
