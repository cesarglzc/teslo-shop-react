// https://github.com/Klerith/bolt-product-editor

import { Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { useProduct } from '@/admin/hooks/useProduct';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { ProductForm } from './ui/ProductForm';
import type { Product } from '@/interfaces/product.interface';

// interface Product {
//   id: string;
//   title: string;
//   price: number;
//   description: string;
//   slug: string;
//   stock: number;
//   sizes: string[];
//   gender: string;
//   tags: string[];
//   images: string[];
// }

export const AdminProductPage = () => {
  const { id } = useParams();

  const navigate = useNavigate()

  const { isLoading, isError, data: product, mutation} = useProduct(id || '')

  // console.log({mutation: mutation.isPending})

  const title = id === 'new' ? 'Nuevo producto' : 'Editar producto';
  const subtitle =
    id === 'new'
      ? 'Aquí puedes crear un nuevo producto.'
      : 'Aquí puedes editar el producto.';

  
  const handleSubmit = async(productLike: Partial<Product> & { files?: File[] }) => {

    await mutation.mutateAsync(productLike, {
      onSuccess: (data) => {
        toast.success('Producto actualizado correctamente', {
          position: 'top-right'
        })
        navigate(`/admin/products/${data.id}`)
      },
      onError: (error) => {
        console.log(error)
        toast.error('Error al actualizar el producto')
      }
    })

  }

  // const [product, setProduct] = useState<Product>({
  //   id: '376e23ed-df37-4f88-8f84-4561da5c5d46',
  //   title: "Men's Raven Lightweight Hoodie",
  //   price: 115,
  //   description:
  //     "Introducing the Tesla Raven Collection. The Men's Raven Lightweight Hoodie has a premium, relaxed silhouette made from a sustainable bamboo cotton blend. The hoodie features subtle thermoplastic polyurethane Tesla logos across the chest and on the sleeve with a french terry interior for versatility in any season. Made from 70% bamboo and 30% cotton.",
  //   slug: 'men_raven_lightweight_hoodie',
  //   stock: 10,
  //   sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  //   gender: 'men',
  //   tags: ['hoodie'],
  //   images: [
  //     'https://placehold.co/250x250',
  //     'https://placehold.co/250x250',
  //     'https://placehold.co/250x250',
  //     'https://placehold.co/250x250',
  //   ],
  // });



  // 
  if(isError){
    return <Navigate to='/admin/products' />
  }
  if(isLoading){
    return <CustomFullScreenLoading />
  }

  // const handleInputChange = (field: keyof Product, value: string | number) => {
  //   setProduct((prev) => ({ ...prev, [field]: value }));
  // };


  if(!product){
    return <Navigate to='/admin/products' /> 
  }


  return (
    <ProductForm title={title} subTitle={subtitle} product={product} onSubmit={handleSubmit} isPending={mutation.isPending} />
  );
};