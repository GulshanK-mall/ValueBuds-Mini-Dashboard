import React, { useState, useEffect } from 'react'

function DetailView({ entity, entityType, onBack, apiBase }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)

      const id = entityType === 'products' ? entity.product_id : entity.producer_id;
      
      try {
        const response = await fetch(`${apiBase}/${entityType}/${id}`)
        
        if (!response.ok) {
          console.error(`Failed to fetch ${entityType} details:`, response.status, response.statusText)
          setDetails(null)
          return
        }
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          console.error(`Expected JSON response but received HTML`)
          setDetails(null)
          return
        }
        
        const result = await response.json()
        setDetails(result.data)
      } catch (error) {
        console.error('Error fetching details:', error)
        setDetails(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [entity.producer_id, entity.product_id, entityType, apiBase])

  if (loading) {
    return (
      <div className="detail-view-container">
        <div className="detail-view-loading">Loading details...</div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="detail-view-container">
        <button 
          onClick={onBack} 
          className="detail-view-back-button"
        >
          ← Back
        </button>
        <div className="detail-view-error">Failed to load details</div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="detail-view-container">
      <button 
        onClick={onBack} 
        className="detail-view-back-button"
      >
        ← Back to List
      </button>
      
      <div className="detail-view-content">
        <h2 className="detail-view-title">
          {entityType === 'producers' ? details.producer : details.brand_name || 'N/A'}
        </h2>
        
        {entityType === 'producers' ? (
          <>
            {/* Producer Basic Info */}
            <div className="detail-section">
              <h3 className="detail-section-title">Basic Information</h3>
              <div className="detail-view-grid">
                <DetailRow label="Producer ID" value={details.producer_id} />
                <DetailRow label="P ID" value={details.p_id} />
                <DetailRow label="Producer Name" value={details.producer} />
                <DetailRow label="City" value={details.city} />
                <DetailRow label="Store Name" value={details.store_name} />
                <DetailRow label="Type" value={details.type} />
                <DetailRow label="CCC" value={details.ccc} />
                <DetailRow label="Active" value={details.active ? 'Yes' : 'No'} />
                <DetailRow label="Description" value={details.description} fullWidth />
                <DetailRow label="Comment" value={details.comment} fullWidth />
              </div>
            </div>

            {/* Locations */}
            {details.locations && details.locations.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Locations ({details.locations.length})</h3>
                {details.locations.map((location, index) => (
                  <div key={location.id || index} className="detail-subsection">
                    <h4 className="detail-subsection-title">Location {index + 1}</h4>
                    <div className="detail-view-grid">
                      <DetailRow label="Address" value={location.address} />
                      <DetailRow label="Full Address" value={location.full_address} fullWidth />
                      <DetailRow label="Province" value={location.province} />
                      <DetailRow label="Postal Code" value={location.postal_code} />
                      <DetailRow label="Country" value={location.country} />
                      <DetailRow label="Longitude" value={location.longitude} />
                      <DetailRow label="Latitude" value={location.latitude} />
                      <DetailRow label="CCC" value={location.ccc} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contacts */}
            {details.contacts && details.contacts.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Contacts ({details.contacts.length})</h3>
                {details.contacts.map((contact, index) => (
                  <div key={contact.id || index} className="detail-subsection">
                    <h4 className="detail-subsection-title">Contact {index + 1}</h4>
                    <div className="detail-view-grid">
                      <DetailRow label="Contact Name" value={contact.contact_name} />
                      <DetailRow label="Phone" value={contact.phone} />
                      <DetailRow label="Phone 2" value={contact.phone_2} />
                      <DetailRow label="Email" value={contact.email} />
                      <DetailRow label="Private Email" value={contact.email_private} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Licenses */}
            {details.licenses && details.licenses.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Licenses ({details.licenses.length})</h3>
                {details.licenses.map((license, index) => (
                  <div key={license.id || index} className="detail-subsection">
                    <h4 className="detail-subsection-title">License {index + 1}</h4>
                    <div className="detail-view-grid">
                      <DetailRow label="License Type" value={license.license_type} />
                      <DetailRow label="Date Licensed" value={license.date_licensed} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Media */}
            {details.media && details.media.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Media & Social ({details.media.length})</h3>
                {details.media.map((media, index) => (
                  <div key={media.id || index} className="detail-subsection">
                    <h4 className="detail-subsection-title">Media {index + 1}</h4>
                    <div className="detail-view-grid">
                      <DetailRow 
                        label="Page URL" 
                        value={media.page_url ? (
                          <a href={media.page_url} target="_blank" rel="noopener noreferrer">
                            {media.page_url}
                          </a>
                        ) : '-'} 
                        fullWidth
                      />
                      <DetailRow 
                        label="Link" 
                        value={media.link ? (
                          <a href={media.link} target="_blank" rel="noopener noreferrer">
                            {media.link}
                          </a>
                        ) : '-'} 
                        fullWidth
                      />
                      <DetailRow label="Social" value={media.social} fullWidth />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Products view
          <>
            {/* Product Basic Info */}
            <div className="detail-section">
              <h3 className="detail-section-title">Basic Information</h3>
              <div className="detail-view-grid">
                <DetailRow label="Product ID" value={details.product_id} />
                <DetailRow label="P ID" value={details.p_id} />
                <DetailRow label="SKU" value={details.sku} />
                <DetailRow label="Brand Name" value={details.brand_name} />
                <DetailRow label="Manufacturer" value={details.manufacturer} />
                <DetailRow label="Quantity" value={details.quantity} />
                <DetailRow label="Weight" value={details.weight ? `${details.weight} ${details.weight_unit || 'kg'}` : '-'} />
                <DetailRow label="Equivalency" value={details.equivalency} />
                <DetailRow 
                  label="Page URL" 
                  value={details.page_url ? (
                    <a href={details.page_url} target="_blank" rel="noopener noreferrer">
                      {details.page_url}
                    </a>
                  ) : '-'} 
                  fullWidth
                />
                <DetailRow 
                  label="Main Image" 
                  value={details.main_image ? (
                    <a href={details.main_image} target="_blank" rel="noopener noreferrer">
                      View Image
                    </a>
                  ) : '-'} 
                />
                <DetailRow label="Created At" value={formatDate(details.created_at)} />
              </div>
            </div>

            {/* Descriptions */}
            {details.descriptions && (
              <div className="detail-section">
                <h3 className="detail-section-title">Description</h3>
                <div className="detail-view-grid">
                  <DetailRow label="Description" value={details.descriptions.description} fullWidth />
                  <DetailRow label="Additional Information" value={details.descriptions.additional_information} fullWidth />
                  <DetailRow label="Meta Title" value={details.descriptions.meta_title} fullWidth />
                  <DetailRow label="Meta Description" value={details.descriptions.meta_description} fullWidth />
                </div>
              </div>
            )}

            {/* Categories */}
            {details.categories && details.categories.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Categories ({details.categories.length})</h3>
                {details.categories.map((category, index) => (
                  <div key={category.id || index} className="detail-subsection">
                    <h4 className="detail-subsection-title">Category Tree {index + 1}</h4>
                    <div className="detail-view-grid">
                      <DetailRow label="Tree Number" value={category.tree_number} />
                      <DetailRow label="Parent" value={category.parent} />
                      <DetailRow label="Level 1" value={category.level_1} />
                      <DetailRow label="Level 2" value={category.level_2} />
                      <DetailRow label="Level 3" value={category.level_3} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Attributes */}
            {details.attributes && details.attributes.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Attributes ({details.attributes.length})</h3>
                <div className="detail-subsection">
                  <div className="detail-view-grid">
                    {details.attributes.map((attr, index) => (
                      <DetailRow 
                        key={attr.id || index}
                        label={attr.attribute_name} 
                        value={attr.attribute_value} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pricing */}
            {details.pricing && details.pricing.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Pricing History ({details.pricing.length})</h3>
                {details.pricing.map((pricing, index) => (
                  <div key={pricing.id || index} className="detail-subsection">
                    <h4 className="detail-subsection-title">Price Record {index + 1}</h4>
                    <div className="detail-view-grid">
                      <DetailRow 
                        label="Price" 
                        value={pricing.price ? `${pricing.currency || '$'}${parseFloat(pricing.price).toFixed(2)}` : '-'} 
                      />
                      <DetailRow 
                        label="Old Price" 
                        value={pricing.old_price ? `${pricing.currency || '$'}${parseFloat(pricing.old_price).toFixed(2)}` : '-'} 
                      />
                      <DetailRow label="Currency" value={pricing.currency} />
                      <DetailRow label="CCC" value={pricing.ccc} />
                      <DetailRow label="Recorded At" value={formatDate(pricing.recorded_at)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Images */}
            {details.images && details.images.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Images ({details.images.length})</h3>
                {details.images.map((image, index) => (
                  <div key={image.id || index} className="detail-subsection">
                    <h4 className="detail-subsection-title">Image {index + 1}</h4>
                    <div className="detail-view-grid">
                      <DetailRow label="Type" value={image.image_type} />
                      <DetailRow label="Sort Order" value={image.sort_order} />
                      <DetailRow 
                        label="Image URL" 
                        value={image.image_url ? (
                          <a href={image.image_url} target="_blank" rel="noopener noreferrer">
                            View Image
                          </a>
                        ) : '-'} 
                        fullWidth
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Options */}
            {details.options && details.options.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Options ({details.options.length})</h3>
                {details.options.map((option, index) => (
                  <div key={option.id || index} className="detail-subsection">
                    <h4 className="detail-subsection-title">{option.option_name}</h4>
                    <div className="detail-view-grid">
                      <DetailRow label="Type" value={option.option_type} />
                      <DetailRow label="Value" value={option.option_value} />
                      <DetailRow label="Price Prefix" value={option.option_price_prefix} />
                      <DetailRow 
                        label="Image" 
                        value={option.option_image ? (
                          <a href={option.option_image} target="_blank" rel="noopener noreferrer">
                            View Image
                          </a>
                        ) : '-'} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews */}
            {details.reviews && (
              <div className="detail-section">
                <h3 className="detail-section-title">Reviews</h3>
                <div className="detail-view-grid">
                  <DetailRow label="Reviews Count" value={details.reviews.reviews_count} />
                  <DetailRow label="Rating" value={details.reviews.rating ? `${details.reviews.rating} / 5.0` : '-'} />
                  <DetailRow 
                    label="Review Link" 
                    value={details.reviews.review_link ? (
                      <a href={details.reviews.review_link} target="_blank" rel="noopener noreferrer">
                        View Reviews
                      </a>
                    ) : '-'} 
                    fullWidth
                  />
                </div>
              </div>
            )}

            {/* Stocks */}
            {details.stocks && (
              <div className="detail-section">
                <h3 className="detail-section-title">Stock Information</h3>
                <div className="detail-view-grid">
                  <DetailRow label="Quantity" value={details.stocks.quantity} />
                  <DetailRow label="Weight" value={details.stocks.weight ? `${details.stocks.weight} ${details.stocks.weight_unit || 'kg'}` : '-'} />
                  <DetailRow label="Out of Stock" value={details.stocks.out_of_stock_status ? 'Yes' : 'No'} />
                  <DetailRow label="Equivalency" value={details.stocks.equivalency} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value, fullWidth }) {
  return (
    <div className={`detail-row ${fullWidth ? 'detail-row-full' : ''}`}>
      <div className="detail-row-label">{label}:</div>
      <div className="detail-row-value">{value || '-'}</div>
    </div>
  )
}

export default DetailView
