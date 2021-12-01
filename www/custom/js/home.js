let hotelTemplate = `<div class="col-md-4 col-lg-4 col-sm-6 col-xs-12">
						<div class="product-thumb">
							<div class="image">
								<a href="#"><img style="width:100%; height: 302px" src="{{imageUrl}}" alt="p1" title="p1" class="img-responsive"/></a>
								<div class="hoverbox">
									<div class="icon_plus" aria-hidden="true"></div>
								</div>
								<div class="matter">
									<h2>{{name}}</h2>
									<p>Bắt đầu từ {{price}}VND </p>
									<ul class="list-inline">
										<li><a href="#">Giá hàng đầu</a></li>
										<li><a href="#">giao dịch khách sạn </a></li>
									</ul>
								</div>
							</div>
							<div class="caption">
								<div class="inner">
									<img src="images/icon-map.png" class="img-responsive" title="map" alt="map" />
									<h4>{{name}}</h4>
									<div class="rate">
										<span>{{view}} lượt xem </span>
										{{ratting}}
									
									</div>
								</div>
															
							</div>
						</div>
					</div>`;
					
	$('#place-tab').on('click','.place-tab-item', function()
	{       let self = this;
			let data = {
                query:'match (p:Place{name:{location}})-[:HAS_HOTEL]->(h) return h limit 6',
                params: {
                    location: $(self).find("a").attr("data-place-name"), 
                }
            }

            $.ajax({
                type:"post",
                url:`${config.baseUrl}/db/data/cypher`,
                contentType: 'application/json',
                dataType:'json',
                headers:{
                    "Authorization": "Basic bmVvNGo6MTIzNDU2"
                },
                data:JSON.stringify(data),

                success: (result,status,ajaxInstance) => {
                    
                    // $.each(result.data, (i,item)=>{

					// })   			
					let tabId = $(self).find("a").attr("href");
					let currentTab = $(tabId);
					currentTab.empty();
                    $(result.data).each((i,item)=>{
						currentTab.append(hotelTemplate
						.replace(/{{name}}/gi, truncateText(item[0].data.name, 26))
						.replace(/{{imageUrl}}/gi, item[0].data.imageUrl)
						.replace(/{{price}}/gi, item[0].data.price)
						.replace(/{{view}}/gi, Math.floor((Math.random() * 3000) + 500))
						.replace(/{{ratting}}/gi, generateRatting())
						);

						
                    })
                } 

            })
	})