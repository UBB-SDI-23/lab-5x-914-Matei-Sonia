from django.db.models import Avg, Count, Subquery
from django.db.models.functions import Length
from rest_framework.generics import get_object_or_404

from passwords.serializers import *
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, mixins
from rest_framework.decorators import api_view


@api_view(['GET'])
def greater_than(request, id):
    if request.method == "GET":
        account_passwords = PasswordAccount.objects.filter(id__gt=id)
        classic_passwords = PasswordClassic.objects.filter(id__gt=id)
        tags = Tag.objects.filter(id__gt=id)

        serializer_ac = PasswordAccountSerializerList(account_passwords, many=True)
        serializer_cl = PasswordClassicSerializerList(classic_passwords, many=True)
        serializer_tg = TagSerializerList(tags, many=True)

        content = {
            "account_passw": serializer_ac.data,
            "classic_passw": serializer_cl.data,
            "tag": serializer_tg.data,
        }

        return Response(content)\


class VaultList(generics.ListCreateAPIView):
    queryset = Vault.objects.all()
    serializer_class = VaultSerializerList


class VaultDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vault.objects.all()
    serializer_class = VaultSerializerDetails


class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializerList


class TagDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializerDetails


class PasswordAccountList(generics.ListCreateAPIView):
    queryset = PasswordAccount.objects.all()
    serializer_class = PasswordAccountSerializerList


class PasswordAccountDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = PasswordAccount.objects.all()
    serializer_class = PasswordAccountSerializerDetails


class PasswordClassicList(generics.ListCreateAPIView):
    queryset = PasswordClassic.objects.all()
    serializer_class = PasswordClassicSerializerList


class PasswordClassicDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = PasswordClassic.objects.all()
    serializer_class = PasswordClassicSerializerDetails


class TagAccountPasswordList(APIView):
    def post(self, request, pk):
        request.data["password"] = pk
        serializer = TagPasswordSerializer(data=request.data)
        serializer.fields['tag'] = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all())
        # serializer.fields['password'] = serializers.PrimaryKeyRelatedField(queryset=PasswordAccount.objects.all())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TagAccountPasswordDetails(APIView):
    @staticmethod
    def get_object(pwd_id, tag_id):
        try:
            return TagPassword.objects.get(password=pwd_id, tag=tag_id)
        except TagPassword.DoesNotExist:
            raise Http404

    def patch(self, request, pwd_id, tag_id):
        relation = self.get_object(pwd_id, tag_id)
        serializer = TagPasswordSerializer(instance=relation, data=request.data, partial=True, exclude_fields=["tag", "password"])
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pwd_id, tag_id):
        relation = self.get_object(pwd_id, tag_id)
        relation.delete()
        return Response({"message": "Deleted."})

#1834


class AccountPasswordTagList(APIView):
    def post(self, request, pk):
        request.data["tag"] = pk
        serializer = TagPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderVaultsByPasswords(generics.ListAPIView):
    serializer_class = VaultOrderSerializerList

    def get_queryset(self):
        queryset = Vault.objects.annotate(avg_password_length=Avg(Length('account_passwords__password'))).order_by("-avg_password_length")
        return queryset


class OrderPasswordsByTags(generics.ListCreateAPIView):
    serializer_class = OrderPasswordsByTagsSerializer

    def get_queryset(self):
        queryset = PasswordAccount.objects.annotate(count_tags=Count("tags")).order_by("-count_tags")
        return queryset


class MultipleTagsToVault(APIView):
    def post(self, request, pk):
        tags = []

        for tag_data in request.data:
            tags.append(get_object_or_404(Tag, pk=tag_data['id']))

        for i, tag_data in enumerate(request.data):
            tag_data['vault'] = pk
            serializer = TagSerializerDetails(tags[i], data=tag_data, partial=True)
            serializer.fields['vault'] = serializers.PrimaryKeyRelatedField(queryset=Vault.objects.all())

            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


class VaultViewForAutocomplete(APIView):
    serializer_class = VaultSerializerList

    def get(self, request, *args, **kwargs):

        query = request.GET.get('query')
        vaults = Vault.objects.filter(title__icontains=query).order_by('title')[:10]
        serializer = VaultSerializerList(vaults, many=True)
        return Response(serializer.data)


class TagViewForAutocomplete(APIView):
    serializer_class = TagSerializerList

    def get(self, request, pk, *args, **kwargs):
        query = request.GET.get('query')
        tags = Tag.objects.filter(title__icontains=query).filter(vault=pk).order_by('title')[:10]
        serializer = TagSerializerList(tags, many=True)
        return Response(serializer.data)
