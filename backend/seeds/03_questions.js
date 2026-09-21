// ============================================================
// Seed : questions/réponses initiales, réparties par thème.
// Reprend la base de connaissances du POC, désormais organisée
// par thème en base de données (au moins 50 couples Q/R au total).
// ============================================================

const DATA = {
  "Nettoyage & Hydratation": [
    {
      question: "Comment bien nettoyer son visage ?",
      answer:
        "Il est recommandé de nettoyer son visage matin et soir avec un nettoyant doux adapté à votre type de peau. Évitez l'eau trop chaude qui dessèche la peau et séchez en tamponnant délicatement avec une serviette propre.",
    },
    {
      question: "Pourquoi hydrater sa peau ?",
      answer:
        "L'hydratation maintient la barrière cutanée, prévient le dessèchement et garde la peau souple. Une peau bien hydratée paraît plus lisse, plus lumineuse et vieillit mieux dans le temps.",
    },
    {
      question: "Qu'est-ce que l'exfoliation ?",
      answer:
        "L'exfoliation consiste à éliminer les cellules mortes à la surface de la peau pour l'affiner et lui redonner de l'éclat. Elle peut être mécanique (gommage) ou chimique (acides).",
    },
    {
      question: "À quelle fréquence faut-il exfolier sa peau ?",
      answer:
        "Une à deux fois par semaine suffit généralement. Une exfoliation trop fréquente peut irriter la peau et abîmer sa barrière protectrice naturelle.",
    },
    {
      question: "Comment bien utiliser un gommage ?",
      answer:
        "Appliquez le gommage sur une peau humide, massez délicatement en mouvements circulaires puis rincez à l'eau tiède. Évitez de frotter trop fort pour ne pas irriter la peau.",
    },
    {
      question: "Faut-il utiliser une crème de jour ?",
      answer:
        "Oui, la crème de jour hydrate et protège la peau des agressions extérieures comme la pollution et les UV. Choisissez idéalement une formule contenant un SPF.",
    },
    {
      question: "Quelle est l'utilité d'une crème de nuit ?",
      answer:
        "La crème de nuit accompagne la régénération naturelle de la peau pendant le sommeil. Elle est souvent plus riche et nourrissante que la crème de jour.",
    },
    {
      question: "À quoi servent les masques pour le visage ?",
      answer:
        "Les masques apportent un soin intensif ponctuel : hydratation, purification ou éclat selon leur formule. Ils complètent une routine sans la remplacer et s'utilisent une à deux fois par semaine.",
    },
    {
      question: "Le maquillage abîme-t-il la peau ?",
      answer:
        "Le maquillage n'abîme pas la peau en soi, mais il est essentiel de bien se démaquiller chaque soir et de choisir des produits non comédogènes adaptés à son type de peau.",
    },
    {
      question: "Pourquoi le démaquillage est-il important ?",
      answer:
        "Le démaquillage élimine les résidus de maquillage, de sébum et de pollution accumulés dans la journée, évitant ainsi l'obstruction des pores et l'apparition de boutons.",
    },
    {
      question: "Quel nettoyant choisir selon son type de peau ?",
      answer:
        "Les peaux grasses préfèrent un gel nettoyant moussant, les peaux sèches un lait ou une huile démaquillante, et les peaux sensibles une eau micellaire douce.",
    },
    {
      question: "À quoi sert une lotion tonique ?",
      answer:
        "La lotion tonique complète le nettoyage, élimine les dernières impuretés et prépare la peau à mieux absorber les soins suivants comme le sérum ou la crème.",
    },
  ],

  "Acné & Imperfections": [
    {
      question: "Comment traiter l'acné ?",
      answer:
        "Pour traiter l'acné, utilisez un nettoyant doux, des produits non comédogènes adaptés et évitez de toucher les boutons. Si l'acné persiste ou est sévère, consultez un dermatologue.",
    },
    {
      question: "Qu'est-ce que l'acné hormonale ?",
      answer:
        "L'acné hormonale est liée aux fluctuations hormonales, souvent autour des règles, de la grossesse ou de l'adolescence. Elle apparaît fréquemment sur le bas du visage et la mâchoire.",
    },
    {
      question: "Comment éliminer les points noirs ?",
      answer:
        "Les points noirs peuvent être atténués grâce à une exfoliation douce, des produits à base d'acide salicylique et un nettoyage régulier. Évitez d'extraire les points noirs avec les doigts.",
    },
    {
      question: "Comment prévenir l'apparition des boutons ?",
      answer:
        "Nettoyez votre peau régulièrement, évitez de la toucher souvent, changez votre taie d'oreiller fréquemment et utilisez des produits non comédogènes pour limiter l'obstruction des pores.",
    },
    {
      question: "Comment atténuer les cicatrices d'acné ?",
      answer:
        "Les cicatrices d'acné peuvent être atténuées avec des actifs comme la vitamine C, la niacinamide ou des acides exfoliants, associés à une protection solaire pour éviter les taches.",
    },
    {
      question: "Faut-il consulter un dermatologue régulièrement ?",
      answer:
        "Oui, une consultation annuelle est recommandée pour surveiller l'état de la peau, dépister d'éventuels problèmes et adapter sa routine si nécessaire.",
    },
  ],

  "Anti-âge & Actifs": [
    {
      question: "Comment atténuer les taches brunes ?",
      answer:
        "Les taches brunes peuvent être atténuées avec des ingrédients comme la vitamine C, la niacinamide ou des acides exfoliants, associés à une protection solaire quotidienne indispensable.",
    },
    {
      question: "Quels sont les bienfaits de la vitamine C ?",
      answer:
        "La vitamine C est un antioxydant qui illumine le teint, atténue les taches pigmentaires et stimule la production de collagène. Elle s'applique généralement le matin avant la crème solaire.",
    },
    {
      question: "Qu'est-ce que le rétinol ?",
      answer:
        "Le rétinol est un dérivé de la vitamine A qui accélère le renouvellement cellulaire, lisse les rides et améliore la texture de la peau. Il s'utilise le soir et rend la peau plus sensible au soleil.",
    },
    {
      question: "Comment bien utiliser le rétinol ?",
      answer:
        "Commencez par une faible concentration, deux fois par semaine le soir, puis augmentez progressivement. Appliquez toujours une crème solaire le lendemain matin.",
    },
    {
      question: "À quoi sert l'acide hyaluronique ?",
      answer:
        "L'acide hyaluronique est un actif hydratant puissant capable de retenir l'eau dans la peau. Il repulpe, lisse et redonne de la souplesse à toutes les peaux, même les plus sensibles.",
    },
    {
      question: "Qu'est-ce que la niacinamide ?",
      answer:
        "La niacinamide, ou vitamine B3, régule le sébum, resserre l'apparence des pores et apaise les inflammations. Elle convient à la plupart des types de peau, y compris les peaux sensibles.",
    },
    {
      question: "Qu'est-ce qu'un sérum et à quoi sert-il ?",
      answer:
        "Un sérum est un soin concentré en actifs ciblant un besoin précis, comme l'hydratation, l'éclat ou l'anti-âge. Il s'applique après le nettoyage, avant la crème hydratante.",
    },
    {
      question: "Comment ralentir le vieillissement de la peau ?",
      answer:
        "Une bonne hydratation, une protection solaire quotidienne, une alimentation équilibrée et l'utilisation d'actifs comme le rétinol ou la vitamine C aident à ralentir le vieillissement cutané.",
    },
    {
      question: "Comment atténuer les rides ?",
      answer:
        "Les rides peuvent être atténuées grâce à des soins hydratants riches, des actifs comme le rétinol ou l'acide hyaluronique, et une protection solaire régulière.",
    },
    {
      question: "Peut-on utiliser plusieurs actifs en même temps ?",
      answer:
        "Certains actifs comme le rétinol et la vitamine C peuvent s'irriter mutuellement s'ils sont mal associés. Il est conseillé de les alterner matin et soir ou jour par jour.",
    },
  ],

  "Types & Besoins de peau": [
    {
      question: "Quels sont les différents types de peau ?",
      answer:
        "On distingue généralement quatre types de peau : normale, sèche, grasse et mixte. Il existe aussi la peau sensible, qui peut se combiner à n'importe lequel de ces types.",
    },
    {
      question: "Comment savoir quel est mon type de peau ?",
      answer:
        "Nettoyez votre visage puis attendez une heure sans appliquer de produit. Observez ensuite les zones brillantes (peau grasse), tiraillées (peau sèche) ou mixtes (zone T grasse, joues sèches).",
    },
    {
      question: "Comment prendre soin de la peau sous la barbe ?",
      answer:
        "Nettoyez et hydratez régulièrement la peau sous la barbe pour éviter les irritations et les pellicules. Une huile à barbe peut nourrir à la fois le poil et la peau.",
    },
    {
      question: "Les soins de la peau sont-ils différents pour les hommes ?",
      answer:
        "La peau masculine est souvent plus épaisse et plus grasse. Les hommes peuvent suivre une routine similaire aux femmes, adaptée à leur type de peau et à l'utilisation du rasoir.",
    },
    {
      question: "Quelle routine adopter pour les femmes ?",
      answer:
        "Une routine de base comprend un nettoyant doux, un sérum adapté, une crème hydratante et une protection solaire le matin, avec un démaquillage systématique le soir.",
    },
    {
      question: "Comment prendre soin de ses lèvres ?",
      answer:
        "Exfoliez doucement vos lèvres une fois par semaine et appliquez un baume hydratant régulièrement, surtout en hiver, pour éviter les gerçures et le dessèchement.",
    },
    {
      question: "Comment soigner le contour des yeux ?",
      answer:
        "La peau du contour des yeux est fine et fragile. Utilisez une crème spécifique en tapotant délicatement avec l'annulaire, sans frotter, matin et soir.",
    },
    {
      question: "Comment calmer les rougeurs du visage ?",
      answer:
        "Privilégiez des produits doux, sans parfum, et évitez l'eau trop chaude. Des ingrédients apaisants comme le panthénol ou la centella asiatica aident à réduire les rougeurs.",
    },
    {
      question: "Comment reconnaître une allergie cutanée ?",
      answer:
        "Une allergie cutanée se manifeste souvent par des rougeurs, démangeaisons ou boutons après l'utilisation d'un nouveau produit. Arrêtez son utilisation et consultez un médecin si les symptômes persistent.",
    },
    {
      question: "Comment traiter une peau grasse ?",
      answer:
        "Pour une peau grasse, utilisez des produits légers, non comédogènes, régulant le sébum comme la niacinamide, et évitez les soins trop riches qui peuvent aggraver la brillance.",
    },
    {
      question: "Comment traiter une peau sèche ?",
      answer:
        "Une peau sèche a besoin de soins riches et nourrissants contenant des agents hydratants comme l'acide hyaluronique, le beurre de karité ou les céramides.",
    },
    {
      question: "Comment traiter une peau mixte ?",
      answer:
        "La peau mixte nécessite un équilibre : des soins légers et matifiants sur la zone T, plus grasse, et des soins hydratants sur les joues, souvent plus sèches.",
    },
    {
      question: "Comment traiter une peau sensible ?",
      answer:
        "Privilégiez des produits doux, sans parfum ni alcool, testés dermatologiquement. Introduisez les nouveaux soins progressivement pour éviter les réactions.",
    },
  ],

  "Mode de vie & Habitudes": [
    {
      question: "L'alimentation influence-t-elle la peau ?",
      answer:
        "Oui, une alimentation riche en fruits, légumes, oméga-3 et pauvre en sucres raffinés favorise une peau plus saine et limite les inflammations comme l'acné.",
    },
    {
      question: "Quel est le lien entre sommeil et peau ?",
      answer:
        "Le sommeil permet à la peau de se régénérer. Un manque de sommeil favorise le teint terne, les cernes et accélère le vieillissement cutané.",
    },
    {
      question: "Le stress a-t-il un impact sur la peau ?",
      answer:
        "Oui, le stress augmente la production de cortisol, ce qui peut favoriser l'acné, les rougeurs et rendre la peau plus réactive et fragile.",
    },
    {
      question: "Faut-il boire beaucoup d'eau pour la peau ?",
      answer:
        "Boire suffisamment d'eau aide à maintenir l'hydratation générale de l'organisme, ce qui contribue indirectement à une peau plus souple et en meilleure santé.",
    },
    {
      question: "Quelle est une bonne routine du matin ?",
      answer:
        "Le matin, nettoyez votre visage, appliquez un sérum si besoin, hydratez avec une crème adaptée puis terminez toujours par une protection solaire.",
    },
    {
      question: "Quelle est une bonne routine du soir ?",
      answer:
        "Le soir, démaquillez-vous, nettoyez votre peau en profondeur, appliquez un soin ciblé comme un sérum ou du rétinol, puis terminez par une crème hydratante nourrissante.",
    },
    {
      question: "Comment avoir une beauté naturelle au quotidien ?",
      answer:
        "Une routine simple, une bonne hydratation, un sommeil suffisant et une alimentation équilibrée suffisent souvent à révéler l'éclat naturel de la peau, sans excès de produits.",
    },
    {
      question: "Quels sont les conseils quotidiens essentiels pour la peau ?",
      answer:
        "Nettoyez votre peau matin et soir, hydratez-la, protégez-la du soleil, dormez suffisamment et évitez de toucher votre visage inutilement dans la journée.",
    },
    {
      question: "Combien de temps pour voir les résultats d'une routine ?",
      answer:
        "En général, il faut compter entre quatre et huit semaines d'utilisation régulière pour observer des résultats visibles sur la peau, la patience est essentielle.",
    },
  ],

  "Protection solaire & Saisons": [
    {
      question: "Pourquoi le soleil est-il dangereux pour la peau ?",
      answer:
        "Une exposition excessive au soleil accélère le vieillissement cutané, favorise les taches pigmentaires et augmente le risque de cancer de la peau. Une protection solaire est essentielle.",
    },
    {
      question: "Faut-il mettre de la crème solaire tous les jours ?",
      answer:
        "Oui, il est recommandé d'appliquer une crème solaire chaque jour, même par temps nuageux ou en intérieur près d'une fenêtre, car les rayons UV traversent les nuages et le verre.",
    },
    {
      question: "Quel indice de crème solaire choisir ?",
      answer:
        "Un indice SPF 30 à 50 est généralement recommandé pour une protection quotidienne efficace. Les peaux claires ou sensibles peuvent privilégier un SPF 50+.",
    },
    {
      question: "Comment bien appliquer une protection SPF ?",
      answer:
        "Appliquez une quantité généreuse de crème solaire le matin, en dernière étape de la routine, et renouvelez l'application toutes les deux heures en cas d'exposition prolongée au soleil.",
    },
    {
      question: "Comment adapter sa routine en hiver ?",
      answer:
        "En hiver, privilégiez des soins plus riches et nourrissants pour compenser le froid et le vent qui dessèchent la peau. N'oubliez pas la crème solaire, même en montagne.",
    },
    {
      question: "Comment adapter sa routine en été ?",
      answer:
        "En été, allégez votre routine avec des textures plus fluides, renforcez la protection solaire et pensez à bien vous hydrater en raison de la chaleur.",
    },
    {
      question: "Quel est le rôle de l'humidité pour la peau ?",
      answer:
        "Un air trop sec, notamment en hiver avec le chauffage, peut assécher la peau. Un humidificateur d'intérieur aide à préserver l'hydratation naturelle de la peau.",
    },
    {
      question: "Comment la pollution affecte-t-elle la peau ?",
      answer:
        "La pollution génère des radicaux libres qui accélèrent le vieillissement cutané et ternissent le teint. Un nettoyage soigneux et des antioxydants aident à protéger la peau.",
    },
  ],
};

exports.seed = async function (knex) {
  const existingCount = await knex("chatbot_questions").count("id as count").first();
  if (parseInt(existingCount.count, 10) > 0) {
    return; // Seed idempotent
  }

  const themes = await knex("chatbot_themes").select("id", "name");
  const admin = await knex("admins").orderBy("id", "asc").first();
  const themeIdByName = new Map(themes.map((t) => [t.name, t.id]));

  const rows = [];
  for (const [themeName, questions] of Object.entries(DATA)) {
    const themeId = themeIdByName.get(themeName);
    if (!themeId) continue; // sécurité si le thème n'existe pas
    for (const q of questions) {
      rows.push({
        theme_id: themeId,
        question: q.question,
        answer: q.answer,
        source: "manual",
        is_active: true,
        created_by: admin ? admin.id : null,
      });
    }
  }

  await knex("chatbot_questions").insert(rows);
};
