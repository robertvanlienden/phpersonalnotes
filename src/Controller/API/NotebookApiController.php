<?php

namespace App\Controller\API;

use App\Entity\Notebook;
use App\Serializer\NotebookSerializer;
use App\Serializer\NotebooksSerializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/v1/", name="api_notebooks")
 */
class NotebookApiController extends AbstractController
{
    private NotebookSerializer $notebookSerializer;
    private NotebooksSerializer $notebooksSerializer;

    public function __construct(NotebookSerializer $notebookSerializer, NotebooksSerializer $notebooksSerializer)
    {
        $this->notebookSerializer = $notebookSerializer;
        $this->notebooksSerializer = $notebooksSerializer;
    }

    /**
     * @Route("notebook", name="api_get_notebooks", methods={"GET"})
     */
    public function index(): Response
    {
        $notebooks = $this->getDoctrine()->getRepository(Notebook::class)->findBy(['user' => $this->getUser()]);

        return $this->json($this->notebooksSerializer->serialize($notebooks));
    }

    /**
     * @Route("notebook", name="api_create_notebook", methods={"POST"})
     */
    public function create(Request $request): Response
    {
        $user = $this->getUser();
        $notebook = new Notebook();
        $notebook->setTitle($request->get('title'));
        $user->addNotebook($notebook);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($notebook);
        $entityManager->flush();

        return $this->json($this->notebookSerializer->serialize($notebook), Response::HTTP_CREATED);
    }

    /**
     * @Route("notebook/{id}", name="api_show_notebook", methods={"GET"})
     */
    public function show(Notebook $notebook): Response
    {
        $this->denyAccessUnlessGranted('view', $notebook);

        return $this->json($this->notebookSerializer->serialize($notebook));
    }

    /**
     * @Route("notebook/{id}", name="api_edit_notebook", methods={"PATCH"})
     */
    public function edit(Notebook $notebook, Request $request): Response
    {
        $this->denyAccessUnlessGranted('edit', $notebook);

        $notebook->setTitle($request->get('title'));

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($notebook);
        $entityManager->flush();

        return $this->json($this->notebookSerializer->serialize($notebook), Response::HTTP_OK);
    }

    /**
     * @Route("notebook/{id}", name="api_delete_notebook", methods={"DELETE"})
     */
    public function delete(Notebook $notebook): Response
    {
        $this->denyAccessUnlessGranted('edit', $notebook);

        $entityManager = $this->getDoctrine()->getManager();
        $notes = $notebook->getNotes();

        foreach ($notes as $note) {
            $entityManager->remove($note);
        }

        $entityManager->remove($notebook);
        $entityManager->flush();

        return $this->json([], Response::HTTP_ACCEPTED);
    }
}
