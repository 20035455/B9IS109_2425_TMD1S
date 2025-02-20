# Generated by Django 5.1.4 on 2024-12-12 04:31

import datetime
import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_dSubCompanyt', models.DateField(auto_now_add=True)),
                ('updated_dt', models.DateField(auto_now=True)),
                ('created_tm', models.TimeField(auto_now_add=True)),
                ('updated_tm', models.TimeField(auto_now=True)),
                ('status', models.CharField(max_length=10, null=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('permission', models.BooleanField(default=False)),
                ('authuser', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership1', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Costumer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_dSubCompanyt', models.DateField(auto_now_add=True)),
                ('updated_dt', models.DateField(auto_now=True)),
                ('created_tm', models.TimeField(auto_now_add=True)),
                ('updated_tm', models.TimeField(auto_now=True)),
                ('status', models.CharField(max_length=10, null=True)),
                ('uid', models.UUIDField(default=uuid.uuid4)),
                ('customer_firstname', models.TextField(db_index=True)),
                ('customer_lastname', models.TextField(db_index=True, null=True)),
                ('customer_email', models.EmailField(max_length=254)),
                ('customer_image', models.FileField(null=True, upload_to='customer_image')),
                ('customer_phone_no', models.CharField(max_length=255, null=True)),
                ('payment_method', models.CharField(choices=[('cash', 'cash'), ('gpay', 'gpay'), ('bank', 'bank')], max_length=25)),
                ('gst_pecentage', models.CharField(max_length=10, null=True)),
                ('order_id', models.CharField(max_length=10, null=True)),
                ('date', models.DateField(default=datetime.date.today)),
                ('profit', models.CharField(max_length=255, null=True)),
                ('total_product_quantity', models.CharField(default=0, max_length=255, null=True)),
                ('total_product', models.CharField(default=0, max_length=255, null=True)),
                ('total_tax_amount', models.CharField(default=0, max_length=255, null=True)),
                ('total_discount_amount', models.CharField(default=0, max_length=255, null=True)),
                ('sub_total_amount', models.CharField(max_length=255, null=True)),
                ('grand_total_amount', models.CharField(default=0, max_length=255, null=True)),
                ('cgst_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10000)),
                ('sgst_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10000)),
                ('company_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='customer.company')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership1', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='ProductCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_dSubCompanyt', models.DateField(auto_now_add=True)),
                ('updated_dt', models.DateField(auto_now=True)),
                ('created_tm', models.TimeField(auto_now_add=True)),
                ('updated_tm', models.TimeField(auto_now=True)),
                ('status', models.CharField(max_length=10, null=True)),
                ('category_name', models.CharField(max_length=50, null=True)),
                ('company_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='customer.company')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership1', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='ProductMaster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_dSubCompanyt', models.DateField(auto_now_add=True)),
                ('updated_dt', models.DateField(auto_now=True)),
                ('created_tm', models.TimeField(auto_now_add=True)),
                ('updated_tm', models.TimeField(auto_now=True)),
                ('status', models.CharField(max_length=10, null=True)),
                ('uid', models.UUIDField(default=uuid.uuid4)),
                ('product_name', models.CharField(max_length=255)),
                ('supplier_name', models.CharField(max_length=255, null=True)),
                ('product_description', models.TextField(null=True)),
                ('inventory_location', models.CharField(max_length=255, null=True)),
                ('purchase_amount', models.CharField(max_length=255, null=True)),
                ('product_hsn', models.CharField(max_length=255, null=True)),
                ('number', models.TextField(null=True)),
                ('photo', models.FileField(null=True, upload_to='product_pic')),
                ('active_status', models.BooleanField(default=True)),
                ('booked_count', models.IntegerField(null=True)),
                ('product_left_count', models.IntegerField(null=True)),
                ('delete_status', models.BooleanField(default=True)),
                ('product_company_name', models.CharField(max_length=255, null=True)),
                ('quantity_for_amount', models.TextField(null=True)),
                ('product_code', models.CharField(max_length=255, null=True)),
                ('sale_price_without_gst', models.DecimalField(decimal_places=2, default=0, max_digits=50)),
                ('total_amount', models.DecimalField(decimal_places=2, default=0, max_digits=50)),
                ('gst_percentage', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('gst_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10000)),
                ('cgst_percentage', models.DecimalField(decimal_places=2, default=0, max_digits=10000)),
                ('cgst_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10000)),
                ('sgst_percentage', models.DecimalField(decimal_places=2, default=0, max_digits=10000)),
                ('sgst_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10000)),
                ('category_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='EventBooth_ctaegoryid', to='customer.productcategory')),
                ('company_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='customer.company')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership1', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='CustomerProductDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_dSubCompanyt', models.DateField(auto_now_add=True)),
                ('updated_dt', models.DateField(auto_now=True)),
                ('created_tm', models.TimeField(auto_now_add=True)),
                ('updated_tm', models.TimeField(auto_now=True)),
                ('status', models.CharField(max_length=10, null=True)),
                ('uid', models.UUIDField(default=uuid.uuid4)),
                ('product_name', models.CharField(max_length=255, null=True)),
                ('product_sale_price', models.DecimalField(decimal_places=2, default=0, max_digits=10000)),
                ('product_quantity', models.IntegerField(null=True)),
                ('discount_percentage', models.CharField(max_length=255, null=True)),
                ('discount_amount', models.CharField(max_length=255, null=True)),
                ('gst_percentage', models.CharField(max_length=255, null=True)),
                ('gst_amount', models.CharField(max_length=255, null=True)),
                ('total_amount', models.CharField(max_length=255, null=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership', to=settings.AUTH_USER_MODEL)),
                ('customer_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='customer.costumer')),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership1', to=settings.AUTH_USER_MODEL)),
                ('customer_product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='EventExhibitor_eventbooth_id', to='customer.productmaster')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SubCompany',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_dSubCompanyt', models.DateField(auto_now_add=True)),
                ('updated_dt', models.DateField(auto_now=True)),
                ('created_tm', models.TimeField(auto_now_add=True)),
                ('updated_tm', models.TimeField(auto_now=True)),
                ('status', models.CharField(max_length=10, null=True)),
                ('uid', models.UUIDField(default=uuid.uuid4)),
                ('company_name', models.CharField(max_length=50, null=True)),
                ('email', models.CharField(max_length=100, null=True)),
                ('phone', models.CharField(max_length=15, null=True)),
                ('photo', models.FileField(null=True, upload_to='company')),
                ('location', models.CharField(max_length=200, null=True)),
                ('gst_number', models.CharField(max_length=250, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('company_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='customer.company')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_ownership1', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-id',),
            },
        ),
        migrations.AddField(
            model_name='productmaster',
            name='subcompany_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='customer.subcompany'),
        ),
        migrations.AddField(
            model_name='productcategory',
            name='subcompany_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='customer.subcompany'),
        ),
        migrations.AddField(
            model_name='costumer',
            name='subcompany_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='customer.subcompany'),
        ),
    ]
