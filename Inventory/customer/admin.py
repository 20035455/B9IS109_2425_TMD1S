from django.contrib import admin

from customer.models import *

# Register your models here.

admin.site.register(Company)
admin.site.register(SubCompany)
admin.site.register(ProductCategory)
admin.site.register(ProductMaster)
admin.site.register(Costumer)
admin.site.register(CustomerProductDetails)
