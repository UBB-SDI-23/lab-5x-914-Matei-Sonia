from faker import Faker
from random import randint
from copy import deepcopy

# with open("vaults.sql", "w") as file:
#     fake = Faker()
#     list_title_vaults = ['vault', 'work', 'university', 'websites', 'company', 'organization', 'job', 'secret', 'top-secret', 'home', 'school']
#     for i in range(1000):
#         file.write('INSERT INTO passwords_vault (title, description, master_password) VALUES \n')
#         for i in range(999):
#             string = f"('{fake.word(ext_word_list=list_title_vaults)}{randint(1, 10000)}',  " \
#                      f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}'),"
#             file.write(string + '\n')
#         string = f"('{fake.word(ext_word_list=list_title_vaults)}{randint(1, 10000)}',  " \
#                  f"'{fake.sentence(nb_words=4, variable_nb_words=True)}',  '{fake.password()}');"
#         file.write(string + '\n')
#
#     file.flush()
#     file.close()

# with open("classics.sql", "w") as file:
#     fake = Faker()
#     for i in range(1000):
#         file.write('INSERT INTO passwords_passwordclassic (vault, used_for, note, password) VALUES \n')
#         for i in range(999):
#             string = f"({randint(1, 1000000)},  '{fake.sentence(nb_words=2).replace('.', '')}', " \
#                      f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}'),"
#             file.write(string + '\n')
#         string = f"({randint(1, 1000000)},  '{fake.sentence(nb_words=2).replace('.', '')}', " \
#                      f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}');"
#         file.write(string + '\n')
#
#     file.flush()
#     file.close()

# file_tag = open("tags.sql", "w")
# file_accp = open("accounts.sql", "w")
# file_rel = open("relation.sql", "w")
# list_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
#
# fake = Faker()
# for i in range(100):
#
#     file_tag.write('INSERT INTO passwords_tag (vault, title) VALUES \n')
#     file_tag.write('INSERT INTO passwords_passwordaccount (vault, website_or_app, username_or_email, note, password) VALUES \n')
#     for j in range(1000):
#
#         id_vault = randint(1, 1000000)
#         for k in range(10):
#
#             string_tag = f"({id_vault},  '{fake.sentence(nb_words=2).replace('.', '')}'),"
#             file_tag.write(string_tag + '\n')
#
#             string_accp = f"({id_vault},  '{fake.domain_word()}', '{fake.company_email()}', " \
#                      f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}'),"
#             file_accp.write(string_accp + '\n')
#
#         file_rel.write('INSERT INTO passwords_tagpassword (tag, password) VALUES \n')
#         for index_tag in range(10):
#             for index_accp in range(10):
#                 string_rel = f"({list_ids[index_tag]}, {list_ids[index_accp]}),"
#                 file_rel.write(string_rel + '\n')
#
#         list_ids = deepcopy([x + 10 for x in list_ids])
#
#
# file_tag.flush()
# file_accp.flush()
# file_rel.flush()
# file_tag.close()
# file_accp.close()
# file_rel.close()




