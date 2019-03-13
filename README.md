# Madkting

Proyecto de prueba, tabla de productos consumiendo API de Madkting.

- [MaDkting PWA](https://madkting-test.firebaseapp.com/)
- [Repositorio](https://github.com/softwarenacho/madkting)

## Tecnología

Los lenguajes de programación utilizados fueron **JS** y **Ruby**

He creado una **PWA** con **Angular 7**, usando la librería **Material** y utilidades de **CLI**, así como **Sass** para la hoja de estilos, uso **Heroku** para hospedar la **API** y **Firebase** como hosting de la aplicación web, la cual gracias a la configuración de su manifiesto y un service worker que se encarga de poner en cache los assets del proyecto permitiendo una velocidad de carga incrementada en siguientes visitas, gracias a su configuración puede ser añadida como atajo de escritorio y funcionar como una aplicación **standalone** también me enfoqué en la responsividad del mismo, por lo cual está optimizado para su uso en diferentes dispositivos

## Desarrollo

Los componentes del proyecto:

- **Dashboard**: engloba el header de la aplicación y la estructura básica
- **Products**: se conforma de 2 vistas diferentes, la tabla con el listado de productos que fue desarrollado con **Material Table** y sus utilidades, y la vista de detalle de estos la cual una vez abierta se agrega a las pestañas de la aplicación y fue desarrollada usando **flex** para la vista reducida y **grid** para la vista completa

También desarrollé un servicio desde la aplicación web que consume a través de dos diferentes endpoint la API de Madkting, estos fueron desarrollados en **Ruby on Rails**, sobre una API propia, esto con el objetivo de proteger la llave privada que se me compartió y evitar problemas de CORS:

- **Lista de productos**, consume el API de Madkting para obtener los mismos
- **Lista de catalogos**, consume el mismo API para obtener el listado de categorías y tiendas, con el objetivo de llenar correctamente estos datos en las vistas


## Retos

El reto principal de éste proyecto fue la paginación usando las tablas y utilidades de `Material`, las cuales tienen problemas generales con el uso de datos dínamicos

## Oportunidades

- Detalle de `marketplaces`, quedó comentado en el código debido a inconsistencias entre el catálogo y los `ids`s presentados por los productos, pero el objetivo es mostrarlos como una sección más de detalle de producto, con los datos que contienen los mismos, hasta el momento sólo quedaron filtrado, eliminando aquellos que tienen status `not_listed`
- Paginación, será un reto personal lograr hacer funcionar el componente de `Material` o en su defecto desarrollar uno propio, lo cual podría haber sido más sencillo al principio gracias a los links `rel` que se obtienen en la API de Madkting
- Offline, al momento sólo se guardan los assets en cache, pero me gustaría guardar por lo menos el último `request` ejecutado en **localStorage** lo que permitiría la visualización de la table inicial aún sin conexión
- Detalle en html del paquete, actualmente se recibe de la API un string conteniendo html, logré avanzar limpiando las imagenes ya que la mayoria de las pruebas arrojaron error al obtener el archivo y ocasionaban problemas de rendimiento.

### API ENDPOINTS


```
  def madkting
    conn = Faraday.new(url: 'https://api.software.madkting.com') do |f|
      f.headers = { 'Accept' => 'application/json', 'Authorization' => "Token #{ENV["madkting_key"]}" }
      f.adapter  Faraday.default_adapter
    end
    request = "shops/76/products/?page=#{params['page']}&page_size=#{params['page_size']}"
    get = conn.get(request)
    response = {
      code: 200,
      total: get.headers['X-Pagination-Total-Count'],
      page: get.headers['X-Pagination-Current-Page'],
      size: get.headers['X-Pagination-Per-Page'],
      data: get.body.force_encoding("UTF-8")
    }
    begin
      render json: response
    rescue
      render json: apiError
    end
  end

  def madktingConfig
    conn = Faraday.new(url: 'https://api.software.madkting.com') do |f|
      f.headers = { 'Accept' => 'application/json', 'Authorization' => "Token #{ENV["madkting_key"]}" }
      f.adapter  Faraday.default_adapter
    end
    shops = conn.get("shops/")
    categories = conn.get("categories/")
    response = {
      code: 200,
      categories: categories.body.force_encoding("UTF-8"),
      shops: shops.body.force_encoding("UTF-8")
    }
    begin
      render json: response
    rescue=> error
      render json: apiError
    end
  end
  ```
